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
  const previewEnabled = await evaluate("import('/src/pages/never-ending-story/hooks/useStoriesReleased.ts').then(m => m.STORIES_PREVIEW_ENABLED)");
  assert.equal(releaseTime, Date.parse("2026-10-29T01:00:00Z"));
  await send("Emulation.setTimezoneOverride", { timezoneId: "America/Los_Angeles" });
  await setClock(releaseTime - 1);
  await navigate("/never-ending-story");
  if (previewEnabled) {
    assert.equal(await evaluate("!!document.querySelector('main [role=status] time')"), false);
    assert.equal(await evaluate("document.querySelectorAll('main li button').length"), 53);
  } else {
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
  }

  // Review access must also work through participant shortcuts before release.
  await setClock(previewEnabled ? releaseTime - 1 : releaseTime);
  await navigate("/participants");
  const participants = await evaluate("import('/src/data/participants.ts').then(m => m.PARTICIPANTS)");
  const stories = await evaluate("import('/src/pages/never-ending-story/data/stories.ts').then(m => m.NEVER_ENDING_STORIES)");
  const submissions = await evaluate("import('/src/pages/never-ending-story/data/submissions.json').then(m => m.default)");
  assert.equal(stories.length, participants.length);
  assert.equal(stories.length, submissions.length);
  assert.equal(new Set(stories.map((story) => story.image)).size, stories.length);
  for (const participant of participants) {
    const matches = stories.filter((story) => story.participantId === participant.id);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].name, participant.name);
    const submitted = submissions.find((story) => story.name === participant.name
      && story.teamName.toLowerCase().replaceAll(":", "") === participant.teamName.toLowerCase().replaceAll(":", ""));
    assert.ok(submitted);
    assert.equal(matches[0].introduction, submitted.introduction);
    assert.equal(matches[0].content, submitted.content);
    assert.ok(decodeURIComponent(matches[0].image).endsWith(`/${submitted.image}`));
    assert.ok(decodeURIComponent(matches[0].thumbnail).endsWith(`/${submitted.thumbnail}`));
  }
  const namesakes = participants.filter((p) => participants.some((other) => other.id !== p.id && other.name === p.name));
  for (const width of [320, 1024]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: width === 320 ? 568 : 900, deviceScaleFactor: 1, mobile: false });
    await navigate("/never-ending-story");
    const imageSizes = await evaluate(`Promise.all([...document.querySelectorAll('main li img')].map(async (img) => {
      img.loading = 'eager';
      await img.decode();
      const rect = img.getBoundingClientRect();
      return { src: img.getAttribute('src'), width: rect.width, height: rect.height, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight,
        expectedWidth: Number(img.getAttribute('width')), expectedHeight: Number(img.getAttribute('height')),
        availableWidth: img.parentElement.clientWidth - 16 };
    }))`);
    assert.equal(imageSizes.length, stories.length);
    for (const image of imageSizes) {
      assert.ok(stories.some((story) => story.thumbnail === image.src));
      assert.ok(image.naturalWidth > 0 && image.naturalWidth <= 480);
      assert.ok(Math.abs(image.height - image.width * image.expectedHeight / image.expectedWidth) < 1);
      assert.ok(Math.abs(image.width - image.availableWidth) < 1);
      assert.ok(Math.abs(image.height - image.width * image.naturalHeight / image.naturalWidth) < 1);
    }
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);

    // Reusing the modal must reset its own scroll, including a quick reopen.
    const longStories = ["김미주", "김은서"].map((name) => {
      const participant = participants.find((p) => p.name === name && p.teamName === "가디언즈");
      return stories.find((story) => story.participantId === participant.id);
    });
    for (const story of [...longStories, longStories[1]]) {
      await evaluate(`[...document.querySelectorAll('main li button')].find(button =>
        button.querySelector('img').getAttribute('src') === ${JSON.stringify(story.thumbnail)}).click()`);
      await waitFor("!!document.querySelector('dialog.modal[open] article h2')");
      await evaluate("document.querySelector('dialog.modal[open] article img').decode()");
      const scrollTop = await evaluate("document.querySelector('dialog.modal[open] article').scrollTop");
      assert.equal(scrollTop, 0, `Story must open at the top: ${story.name} (${width}px)`);
      const scrolled = await evaluate(`(() => {
        const content = document.querySelector('dialog.modal[open] article');
        const before = content.getBoundingClientRect();
        const imageTop = content.querySelector('img').getBoundingClientRect().top;
        content.scrollTop = content.scrollHeight;
        const after = content.getBoundingClientRect();
        const outer = document.querySelector('dialog.modal[open] > div');
        return { scrollTop: content.scrollTop, before: { top: before.top, height: before.height },
          after: { top: after.top, height: after.height }, imageTop,
          scrolledImageTop: content.querySelector('img').getBoundingClientRect().top,
          outerScrollTop: outer.scrollTop, outerOverflow: outer.scrollHeight - outer.clientHeight };
      })()`);
      assert.ok(scrolled.scrollTop > 0, "The regression check must actually scroll a long story");
      assert.deepEqual(scrolled.after, scrolled.before, "The story box must stay fixed while scrolling");
      assert.ok(scrolled.scrolledImageTop < scrolled.imageTop, "Only the contents should move");
      assert.equal(scrolled.outerScrollTop, 0);
      assert.ok(scrolled.outerOverflow <= 1, "The modal must not have a second scrollbar");
      await evaluate("document.querySelector('dialog.modal[open] > button').click()");
      await waitFor("!document.querySelector('dialog.modal[open]')");
    }

    for (const participant of [participants[0], ...namesakes, participants.find((p) => p.name === '정아로')]) {
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
      const expectedStory = stories.find((story) => story.participantId === participant.id);
      const detail = await evaluate(`(async () => {
        const article = document.querySelector('dialog.modal[open] article');
        const img = article.querySelector('img');
        await img.decode();
        const rect = img.getBoundingClientRect();
        const content = article.querySelector('p:last-child');
        return { image: img.getAttribute('src'), content: content.textContent, whitespace: getComputedStyle(content).whiteSpace,
          width: rect.width, height: rect.height, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
      })()`);
      assert.equal(detail.image, expectedStory.image);
      assert.equal(detail.content, expectedStory.content);
      assert.equal(detail.whitespace, "pre-wrap");
      assert.ok(Math.abs(detail.height - detail.width * detail.naturalHeight / detail.naturalWidth) < 1);
      if (namesakes.includes(participant)) {
        assert.ok(decodeURIComponent(detail.image).endsWith(`/${participant.name}(${participant.teamName}).webp`));
      }
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
  console.log(`Passed: ${previewEnabled ? 'temporary preview before release' : 'scheduled release and automatic unlock'}, ${participants.length} submitted stories and decoded images, width-based aspect ratios at 320/1024px, namesake and HEIC image links, multiline content, fixed story box with internal scrolling, modal scroll reset on different/same story reopen.`);
} finally {
  if (clockScript) await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: clockScript });
  await send("Emulation.setTimezoneOverride", { timezoneId: "" });
  await send("Page.navigate", { url: "about:blank" });
  socket.close();
}
