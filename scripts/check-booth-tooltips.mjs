// Node 22+: node scripts/check-booth-tooltips.mjs [local app URL] [Chrome CDP URL]
import assert from "node:assert/strict";

const appUrl = process.argv[2] ?? "http://127.0.0.1:5178";
const cdpUrl = process.argv[3] ?? "http://127.0.0.1:9228";
const targets = await fetch(`${cdpUrl}/json`).then((response) => response.json());
const target = targets.find(({ type }) => type === "page");
assert.ok(target, "Start Chrome with a remote debugging port first");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let nextId = 0;
const pending = new Map();
const exceptions = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails);
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
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  assert.fail(`Timed out: ${expression}`);
}
async function navigate(path) {
  await send("Page.navigate", { url: `${appUrl}${path}` });
  await waitFor(`location.pathname === ${JSON.stringify(path.split("?")[0])} && !!document.querySelector('main > *')`);
}
const closeSelector = 'button[aria-label="툴팁 닫기"]';
async function checkTooltip(studio, text, color, isGuide = false) {
  await waitFor(`!!document.querySelector(${JSON.stringify(closeSelector)})`);
  const result = await evaluate(`(() => {
    const tooltip = document.querySelector(${JSON.stringify(closeSelector)}).parentElement;
    const plan = document.querySelector('section[aria-label="전시장 배치도"] > div > div');
    const rect = element => { const r = element.getBoundingClientRect(); return { left:r.left, right:r.right, top:r.top, bottom:r.bottom }; };
    return {
      text: tooltip.children[1].textContent,
      leftPadding: tooltip.children[1].getBoundingClientRect().left - tooltip.getBoundingClientRect().left,
      rightPadding: tooltip.getBoundingClientRect().right - tooltip.querySelector('button').getBoundingClientRect().right,
      color: getComputedStyle(tooltip).backgroundColor,
      fontWeight: getComputedStyle(tooltip).fontWeight,
      textHeight: tooltip.children[1].getBoundingClientRect().height,
      lineHeight: parseFloat(getComputedStyle(tooltip).lineHeight),
      frame: rect(document.querySelector('.app-frame')),
      tooltip: rect(tooltip), tail: rect(tooltip.firstElementChild), plan: rect(plan),
      studios: [...plan.querySelectorAll('button[aria-pressed]')].map(button => ({
        number: Number(button.textContent.match(/\\d+/)[0]), rect: rect(button), active:button.getAttribute('aria-pressed') === 'true',
      })),
      scrollTop: document.querySelector('.app-content').scrollTop,
    };
  })()`);
  assert.equal(result.text, text);
  assert.ok(Math.abs(result.leftPadding - 12) < 1, `Left padding: ${result.leftPadding}`);
  assert.ok(Math.abs(result.rightPadding - 12) < 1, `Right padding: ${result.rightPadding}`);
  assert.equal(result.color, color);
  assert.equal(result.scrollTop, 0, "Entry tooltip must remain visible on the floor plan");
  const { tooltip: bubble, plan, tail } = result;
  const horizontalBounds = isGuide ? result.frame : plan;
  assert.ok(bubble.left >= horizontalBounds.left && bubble.right <= horizontalBounds.right + 1, "Tooltip stays inside horizontal bounds");
  assert.equal(result.fontWeight, isGuide ? "400" : "700");
  if (isGuide) assert.equal(result.textHeight, result.lineHeight, "Guide stays on one line");
  assert.ok(bubble.top >= plan.top && bubble.bottom <= plan.bottom + 1, "Tooltip stays inside plan vertically");
  for (const box of result.studios) {
    const r = box.rect;
    const overlap = bubble.left < r.right && bubble.right > r.left && bubble.top < r.bottom && bubble.bottom > r.top;
    if (!isGuide) assert.ok(!overlap, `Tooltip covers studio ${box.number}: ${JSON.stringify(result)}`);
  }
  const selected = result.studios.find((box) => box.number === studio).rect;
  const x = (tail.left + tail.right) / 2;
  const y = (tail.top + tail.bottom) / 2;
  const gap = studio === 5 || studio === 6
    ? tail.top - selected.bottom
    : studio === 10 ? tail.left - selected.right : selected.left - tail.right;
  assert.ok(gap >= 7 && gap <= 9, `Tail gap should be about 8px; got ${gap}`);
  assert.ok(studio === 5 || studio === 6
    ? x >= selected.left && x <= selected.right
    : y >= selected.top && y <= selected.bottom, "Tail points at the correct studio");
  return result;
}

const timeout = setTimeout(() => { console.error("Browser check timed out"); process.exit(1); }, 120_000);
try {
  await send("Runtime.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  for (const width of [320, 390, 1024]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 1, mobile: false });
    await navigate("/home");
    await evaluate("document.querySelector('main a[href=\"/booths\"]').click()");
    await checkTooltip(5, "스튜디오를 눌러 프로젝트를 확인해보세요", "rgb(38, 69, 101)", true);
    await evaluate(`document.querySelector(${JSON.stringify(closeSelector)}).click()`);
    await waitFor(`!document.querySelector(${JSON.stringify(closeSelector)})`);
    await evaluate("document.querySelector('header button[aria-haspopup=dialog]').click()");
    await waitFor("!!document.querySelector('dialog[open] a[href=\"/booths\"]')");
    await evaluate("document.querySelector('dialog[open] a[href=\"/booths\"]').click()");
    await checkTooltip(5, "스튜디오를 눌러 프로젝트를 확인해보세요", "rgb(38, 69, 101)", true);

    const projects = await evaluate("import('/src/data/projects.ts').then(m => m.PROJECTS)");
    for (const project of projects) {
      await navigate("/participants");
      await evaluate(`(async () => {
        const { PARTICIPANTS } = await import('/src/data/participants.ts');
        const index = PARTICIPANTS.findIndex(person => person.projectId === ${JSON.stringify(project.id)});
        document.querySelectorAll('ul[aria-label="참가자"] button')[index].click();
      })()`);
      await waitFor("!!document.querySelector('dialog[open] a[href^=\"/booths?\"]')");
      await evaluate("document.querySelector('dialog[open] a[href^=\"/booths?\"]').click()");
      const result = await checkTooltip(project.studioNumber, project.title,
        [3, 4, 5, 6].includes(project.studioNumber) ? "rgb(38, 69, 101)" : "rgb(239, 121, 168)");
      assert.deepEqual(result.studios.filter((box) => box.active).map((box) => box.number), [project.studioNumber]);
      await evaluate(`document.querySelector(${JSON.stringify(closeSelector)}).click()`);
      await waitFor(`!document.querySelector(${JSON.stringify(closeSelector)})`);
      assert.equal(await evaluate("document.querySelector('.app-content').scrollTop"), 0, "Dismissing must not jump to the list");
      await evaluate(`[...document.querySelectorAll('button[aria-pressed]')].find(b => Number(b.textContent.match(/\\d+/)[0]) === ${project.studioNumber}).click()`);
      await waitFor("document.querySelector('.app-content').scrollTop > 0");
      assert.equal(await evaluate(`!!document.querySelector(${JSON.stringify(closeSelector)})`), false, "Selecting a studio dismisses the entry tooltip");
    }
    console.log(`PASS ${width}px: home/menu guides, all ${projects.length} participant projects, colors, tail direction/gap, no studio overlap, close and selection scroll`);
  }
  await navigate("/booths?studio=3");
  await waitFor("document.querySelector('.app-content').scrollTop > 0");
  assert.equal(await evaluate(`!!document.querySelector(${JSON.stringify(closeSelector)})`), false);
  assert.deepEqual(exceptions, []);
  console.log("PASS plain studio links retain list scrolling; no runtime errors");
} finally {
  clearTimeout(timeout);
  socket.close();
}
