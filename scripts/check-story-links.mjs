// Run with Vite and Chrome CDP: node scripts/check-story-links.mjs
import assert from "node:assert/strict";

const app = process.argv[2] ?? "http://127.0.0.1:5178";
const cdp = process.argv[3] ?? "http://127.0.0.1:9228";
const targets = await fetch(`${cdp}/json`).then((response) => response.json());
const socket = new WebSocket(targets.find((target) => target.type === "page").webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
let id = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(message.error);
  else request.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  pending.set(++id, { resolve, reject });
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
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.fail(`Timed out: ${expression}`);
}
async function navigate(route) {
  const previousDocument = await evaluate("performance.timeOrigin");
  await send("Page.navigate", { url: `${app}${route}` });
  await waitFor(`performance.timeOrigin !== ${previousDocument} && location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && !!document.querySelector('main > *')`);
}

let clockScript;
async function setClock(timestamp, running = false) {
  if (clockScript) await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: clockScript });
  const source = running
    ? `const clockStart = performance.now(); Date.now = () => ${timestamp} + performance.now() - clockStart;`
    : `Date.now = () => ${timestamp};`;
  clockScript = (await send("Page.addScriptToEvaluateOnNewDocument", { source })).identifier;
}

try {
  await send("Page.enable");
  await navigate("/home");
  const releaseTime = await evaluate("import('/src/pages/never-ending-story/hooks/useStoriesReleased.ts').then(m => Date.parse(m.STORIES_RELEASE_AT))");
  assert.equal(releaseTime, Date.parse("2026-10-29T01:00:00Z"));
  await send("Emulation.setTimezoneOverride", { timezoneId: "America/Los_Angeles" });
  await setClock(releaseTime - 1);
  await navigate("/never-ending-story");
  assert.equal(await evaluate("!!document.querySelector('main [role=status] time')"), true);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('main [inert]')).filter"), "blur(12px)");
  assert.equal(await evaluate("document.querySelectorAll('main img, main button[aria-haspopup=dialog], dialog.modal').length"), 0);

  // Participant shortcuts must also remain locked before the release instant.
  await navigate("/participants");
  await evaluate("document.querySelector('main li button').click()");
  await waitFor("!!document.querySelector('dialog.modal[open] a[href=\"/never-ending-story\"]')");
  await evaluate('document.querySelector(\'dialog.modal[open] a[href="/never-ending-story"]\').click()');
  await waitFor("location.pathname === '/never-ending-story' && !!document.querySelector('main [role=status] time')");
  assert.equal(await evaluate("!!document.querySelector('dialog.modal[open]')"), false);
  assert.notEqual(await evaluate("document.body.style.overflow"), "hidden");
  // A background tab resumes after the release and opens the intended story.
  await evaluate(`Date.now = () => ${releaseTime}; document.dispatchEvent(new Event('visibilitychange'));`);
  await waitFor("!!document.querySelector('dialog.modal[open] article h2')");

  // An already-open list unlocks at the exact instant without a reload.
  await navigate("/home");
  await setClock(releaseTime - 3000, true);
  await navigate("/never-ending-story");
  assert.equal(await evaluate("!!document.querySelector('main [role=status] time')"), true);
  await waitFor("!!document.querySelector('main li button')");
  assert.equal(await evaluate("!!document.querySelector('main [role=status] time')"), false);

  // Existing links and namesake mappings still work once released.
  await setClock(releaseTime);
  await navigate("/participants");
  const participants = await evaluate("import('/src/data/participants.ts').then(m => m.PARTICIPANTS)");
  const stories = await evaluate("import('/src/pages/never-ending-story/data/mockNeverEndingStories.ts').then(m => m.MOCK_NEVER_ENDING_STORIES)");
  assert.equal(stories.length, participants.length);
  for (const participant of participants) {
    const matches = stories.filter((story) => story.participantId === participant.id);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].name, participant.name);
  }
  const namesakes = participants.filter((p) => participants.some((other) => other.id !== p.id && other.name === p.name));
  for (const width of [320, 1024]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const participant of [participants[0], ...namesakes]) {
      await navigate("/participants");
      await evaluate(`document.querySelectorAll('main li button')[${participants.indexOf(participant)}].click()`);
      await waitFor("!!document.querySelector('dialog.modal[open] a[href=\"/never-ending-story\"]')");
      const style = await evaluate(`(() => {
        const link = document.querySelector('dialog.modal[open] a[href="/never-ending-story"]');
        const caption = link.parentElement;
        return { gap: caption.getBoundingClientRect().top - caption.previousElementSibling.getBoundingClientRect().bottom,
          bold: getComputedStyle(caption.querySelector('strong')).fontWeight,
          underline: getComputedStyle(link).textDecorationLine,
          font: caption.classList.contains('body-xsmall') };
      })()`);
      assert.equal(style.gap, 20);
      assert.equal(style.bold, "700");
      assert.ok(style.underline.includes("underline") && style.font);
      await evaluate('document.querySelector(\'dialog.modal[open] a[href="/never-ending-story"]\').click()');
      await waitFor("location.pathname === '/never-ending-story' && !!document.querySelector('dialog.modal[open] article h2')");
      assert.equal(await evaluate("history.state.usr.storyParticipantId"), participant.id);
      assert.equal(await evaluate("document.querySelector('dialog.modal[open] article h2').textContent"), participant.name);
      await evaluate("document.querySelector('dialog.modal[open] > button').click()");
      await waitFor("!document.querySelector('dialog.modal[open]')");
      await evaluate("document.querySelector('main li button').click()");
      await waitFor("!!document.querySelector('dialog.modal[open]')");
    }
  }
  // A fresh list entry must not inherit the previous history entry's state.
  await navigate("/home");
  await navigate("/never-ending-story");
  assert.equal(await evaluate("!!document.querySelector('dialog.modal[open]')"), false);
  console.log(`Passed: KST release boundary, blurred preview, locked shortcuts, automatic unlock, tab resume, ${participants.length} participant mappings, namesake links, 20px gap, modal close/reopen.`);
} finally {
  if (clockScript) await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: clockScript });
  await send("Emulation.setTimezoneOverride", { timezoneId: "" });
  await send("Page.navigate", { url: "about:blank" });
  socket.close();
}
