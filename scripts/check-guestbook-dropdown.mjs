// Node 22+: node scripts/check-guestbook-dropdown.mjs [app URL] [Chrome CDP URL] [optional screenshot path]
// Start Vite and a headless Chrome with --remote-debugging-port=9228 before running.
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const appUrl = process.argv[2] ?? "http://127.0.0.1:5178";
const cdpUrl = process.argv[3] ?? "http://127.0.0.1:9228";
const targets = await fetch(`${cdpUrl}/json`).then((response) => response.json());
const target = targets.find(({ type }) => type === "page");
assert.ok(target, "Chrome must expose a page target");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(JSON.stringify(message.error)));
  else request.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
async function evaluate(expression) {
  const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  assert.ok(!response.exceptionDetails, JSON.stringify(response.exceptionDetails));
  return response.result.value;
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  assert.fail(`Timed out: ${expression}`);
}
async function click(selector) {
  const position = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw new Error('Missing element: ' + ${JSON.stringify(selector)});
    element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const rect = element.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  })()`);
  await send("Input.dispatchMouseEvent", { type: "mousePressed", button: "left", clickCount: 1, ...position });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", button: "left", clickCount: 1, ...position });
}
async function key(key, windowsVirtualKeyCode) {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key, windowsVirtualKeyCode });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key, windowsVirtualKeyCode });
}
const combo = 'dialog[open] button[role="combobox"]';
const options = 'dialog[open] [role="option"]';
const isOpen = "!!document.querySelector('dialog[open] [role=\"listbox\"]')";
const timeout = setTimeout(() => { console.error("Browser check timed out"); process.exit(1); }, 60000);

try {
  await send("Emulation.setDeviceMetricsOverride", { width: 393, height: 852, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: `${appUrl}/guestbook` });
  await waitFor("!!document.querySelector('section button[aria-haspopup=\"dialog\"]')");
  const teams = await evaluate("import('/src/pages/guestbook/data/mockGuestbookEntries.ts').then(module => module.GUESTBOOK_TEAMS)");
  const initialEntryCount = await evaluate("document.querySelectorAll('section > ul > li').length");
  assert.deepEqual(await evaluate("Array.from(document.querySelectorAll('section [role=group] button'), button => button.textContent.trim())"), ["전체", "모두에게", ...teams.map(({ teamName }) => teamName)]);
  assert.equal(await evaluate(`(() => {
    const track = document.querySelector('section [role=group]');
    const frame = document.querySelector('.app-frame').getBoundingClientRect();
    const scroll = track.parentElement.getBoundingClientRect();
    return Math.abs(scroll.left - frame.left) < 1 && Math.abs(scroll.width - frame.width) < 1
      && Math.abs(track.querySelector('button').getBoundingClientRect().left - scroll.left - 20) < 1;
  })()`), true, "The filter scroll viewport must span the frame with 20px starting padding");
  await click('section button[aria-haspopup="dialog"]');
  await waitFor(`!!document.querySelector(${JSON.stringify(combo)})`);
  await click('dialog[open] textarea[name="content"]');
  await send("Input.insertText", { text: "Dropdown browser check" });
  await click('dialog[open] input[name="author"]');
  await send("Input.insertText", { text: "CDP visitor" });
  await click('dialog[open] button[type="submit"]');
  await waitFor("document.querySelector('[role=\"combobox\"]')?.getAttribute('aria-invalid') === 'true'");
  assert.equal(await evaluate("document.activeElement.getAttribute('role')"), "combobox");

  await click(combo);
  await waitFor(isOpen);
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll(${JSON.stringify(options)}), option => option.textContent.trim())`), ["모두에게", ...teams.map(({ teamName }) => teamName)]);
  const geometry = await evaluate(`(() => {
    const field = document.querySelector(${JSON.stringify(combo)}).getBoundingClientRect();
    const list = document.querySelector('[role="listbox"]');
    const panel = list.parentElement.getBoundingClientRect();
    return { width: panel.width - field.width, top: panel.top - field.bottom,
      radius: getComputedStyle(list.parentElement).borderRadius,
      optionHeight: list.firstElementChild.getBoundingClientRect().height,
      optionPadding: getComputedStyle(list.firstElementChild).paddingLeft };
  })()`);
  assert.ok(Math.abs(geometry.width) < 1 && Math.abs(geometry.top) < 1, JSON.stringify(geometry));
  assert.equal(geometry.radius, "22px");
  assert.equal(geometry.optionHeight, 40);
  assert.equal(geometry.optionPadding, "26px");

  await click(`${options}:nth-child(4)`);
  await waitFor(`!(${isOpen})`);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).textContent.trim()`), teams[2].teamName);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).hasAttribute('aria-invalid')`), false);
  await click(combo);
  await waitFor(isOpen);
  assert.equal(await evaluate('document.querySelectorAll("[role=option][aria-selected=true] svg").length'), 1);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).querySelector('svg').classList.contains('rotate-180')`), true);
  if (process.argv[4]) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const screenshot = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(process.argv[4], Buffer.from(screenshot.data, "base64"));
  }
  await key("Escape", 27);
  await waitFor(`!(${isOpen})`);
  assert.equal(await evaluate("!!document.querySelector('dialog[open]')"), true, "Escape should close only the dropdown");

  await key("ArrowDown", 40);
  await waitFor(isOpen);
  await key("ArrowDown", 40);
  await key("Enter", 13);
  await waitFor(`!(${isOpen})`);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).textContent.trim()`), teams[3].teamName);
  await key("ArrowUp", 38);
  await waitFor(isOpen);
  await key("ArrowUp", 38);
  await key("Enter", 13);
  await waitFor(`!(${isOpen})`);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).textContent.trim()`), teams[2].teamName);

  await click(combo);
  await waitFor(isOpen);
  await click("dialog[open] h2");
  await waitFor(`!(${isOpen})`);
  assert.equal(await evaluate("!!document.querySelector('dialog[open]')"), true, "Clicking another form area must preserve the dialog");
  await click('dialog[open] button[type="submit"]');
  await waitFor("!document.querySelector('dialog[open]')");
  assert.equal(await evaluate("document.querySelector('section button[aria-pressed=true]').textContent.trim()"), teams[2].teamName);
  assert.equal(await evaluate("document.querySelector('section ul li p').textContent"), `To. ${teams[2].teamName}`);
  assert.equal(await evaluate("document.querySelector('section ul li p + p').textContent"), "Dropdown browser check");
  assert.equal(await evaluate("document.querySelector('section ul li p + p + p').textContent"), "From. CDP visitor");

  await click('section button[aria-haspopup="dialog"]');
  await waitFor(`!!document.querySelector(${JSON.stringify(combo)})`);
  await click(combo);
  await waitFor(isOpen);
  await click(`${options}:first-child`);
  await waitFor(`!(${isOpen})`);
  await click('dialog[open] textarea[name="content"]');
  await send("Input.insertText", { text: "A message for everyone" });
  await click('dialog[open] input[name="author"]');
  await send("Input.insertText", { text: "All-team visitor" });
  await click('dialog[open] button[type="submit"]');
  await waitFor("!document.querySelector('dialog[open]')");
  assert.equal(await evaluate("document.querySelector('section button[aria-pressed=true]').textContent.trim()"), "모두에게");
  assert.deepEqual(await evaluate("Array.from(document.querySelectorAll('section ul li:first-child p'), element => element.textContent)"), ["To. 모두에게", "A message for everyone", "From. All-team visitor"]);
  assert.equal(await evaluate("document.querySelectorAll('section > ul > li').length"), 1);
  await click('section [role="group"] button:first-of-type');
  assert.equal(await evaluate("document.querySelectorAll('section > ul > li').length"), initialEntryCount + 2);
  assert.deepEqual(await evaluate("Array.from(document.querySelectorAll('section > ul > li p:nth-child(2)'), paragraph => paragraph.textContent).slice(0, 2)"), ["A message for everyone", "Dropdown browser check"]);
  await click('section [role="group"] button:nth-of-type(2)');
  assert.equal(await evaluate("document.querySelectorAll('section > ul > li').length"), 1);
  await click('section button[aria-haspopup="dialog"]');
  await waitFor(`!!document.querySelector(${JSON.stringify(combo)})`);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).textContent.trim()`), "모두에게");
  await key("Escape", 27);
  await waitFor("!document.querySelector('dialog[open]')");

  await click('section [role="group"] button:last-of-type');
  await new Promise((resolve) => setTimeout(resolve, 400));
  async function checkIndicator() {
    const state = await evaluate(`(() => {
      const button = document.querySelector('section button[aria-pressed=true]');
      const indicator = button.parentElement.querySelector('span[aria-hidden=true]');
      const selected = button.getBoundingClientRect();
      const line = indicator.getBoundingClientRect();
      const style = getComputedStyle(indicator);
      return { left: line.left - selected.left, width: line.width - selected.width,
        transition: style.transitionProperty, duration: style.transitionDuration };
    })()`);
    assert.ok(Math.abs(state.left) < 1 && Math.abs(state.width) < 1, JSON.stringify(state));
    assert.ok(state.transition.includes("transform") && state.transition.includes("width"));
    assert.ok(state.duration.split(", ").every((duration) => duration === "0.3s"));
  }
  assert.equal(await evaluate("document.querySelector('section button[aria-pressed=true]').textContent.trim()"), teams.at(-1).teamName);
  await checkIndicator();
  assert.equal(await evaluate(`(() => {
    const track = document.querySelector('section [role=group]');
    const scroller = track.parentElement;
    scroller.scrollLeft = scroller.scrollWidth;
    return Math.abs(scroller.getBoundingClientRect().right
      - track.querySelector('button:last-of-type').getBoundingClientRect().right - 20) < 1;
  })()`), true, "The filter must preserve 20px ending padding at maximum scroll");
  assert.equal(await evaluate(`(() => {
    const scroller = document.querySelector('section [role="group"]').parentElement;
    const before = scroller.scrollLeft;
    scroller.scrollLeft = Math.max(0, before - 25);
    return before > 0 && scroller.scrollLeft < before;
  })()`), true, "The team filter must scroll horizontally");
  await checkIndicator();
  await send("Page.navigate", { url: `${appUrl}/guestbook?projectId=all` });
  await waitFor("document.querySelector('section button[aria-pressed=true]')?.textContent.trim() === '모두에게'");
  console.log("PASS: dropdown interactions, recipient validation/cards, everyone-only vs all filters, recipient prefill/deep link, full-width scrolling/padding, and animated underline alignment");
} finally {
  clearTimeout(timeout);
  socket.close();
}
