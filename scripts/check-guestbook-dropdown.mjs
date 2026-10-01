// Node 22+: node scripts/check-guestbook-dropdown.mjs [local app URL] [Chrome CDP URL] [optional screenshot path]
// Start Vite and Chrome with --remote-debugging-port=9228. API responses are intercepted; no live writes.
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
const list = 'ul[aria-label="방명록 목록"]';
const submit = 'dialog[open] button[type="submit"]';
const author = 'dialog[open] input[name="author"]';
const content = 'dialog[open] textarea[name="content"]';
const isOpen = "!!document.querySelector('dialog[open] [role=\"listbox\"]')";
const composeTeamLabels = [
  "모두에게", "가디언즈", "공일공일", "데드락", "아자쓰!", "404", "2233",
  "Axis", "BE1", "exit(0)", "MOOD:E", "PolyStack", "Quadcore",
];
const entries = [
  { id: 101, teamId: "별빛", writer: "관람객 하나", content: "서버에서 받은 첫 응원\n둘째 줄", createdAt: "2026-10-01T10:00:00" },
  { id: 102, teamId: "새로운 외부 팀", writer: "관람객 둘", content: "기존 프로젝트에 없는 팀도 표시합니다.", createdAt: "2026-10-01T10:01:00" },
  { id: 103, teamId: "모두에게", writer: "관람객 셋", content: "모두를 응원합니다.", createdAt: "2026-10-01T10:02:00" },
  { id: 104, teamId: "", writer: "관람객 넷", content: "수신 팀 없는 서버 글", createdAt: "2026-10-01T10:03:00" },
  { id: 105, teamId: "별빛", writer: "관람객 다섯", content: "같은 팀의 두 번째 글", createdAt: "2026-10-01T10:04:00" },
  { id: 106, teamId: "2026 웨이브", writer: "관람객 여섯", content: "또 다른 팀의 글", createdAt: "2026-10-01T10:05:00" },
];
const teamLabels = [
  "가디언즈", "공일공일", "데드락", "별빛", "새로운 외부 팀", "아자쓰!",
  "404", "2026 웨이브", "2233", "Axis", "BE1", "exit(0)", "MOOD:E", "PolyStack", "Quadcore",
  "수신 팀 미지정",
];
const success = (result) => ({ status: 200, body: { isSuccess: true, code: "COMMON200", message: "성공", result } });
let responsePlan = success(entries);
let holdResponses = true;
let heldRequests = [];
let postResponsePlan;
let holdPostResponses = true;
let heldPostRequests = [];
const requests = [];
const blockedWrites = [];
const exceptions = [];
const interceptionErrors = [];
const canceledRequests = new Set();
const handlers = new Set();

async function fulfill(requestId, plan) {
  try {
    if (plan.networkError) return await send("Fetch.failRequest", { requestId, errorReason: "ConnectionFailed" });
    await send("Fetch.fulfillRequest", {
      requestId,
      responseCode: plan.status,
      responseHeaders: [
        { name: "Content-Type", value: plan.contentType ?? "application/json" },
        { name: "Access-Control-Allow-Origin", value: "*" },
        { name: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
        { name: "Access-Control-Allow-Headers", value: "Accept, Content-Type" },
      ],
      body: Buffer.from(typeof plan.body === "string" ? plan.body : JSON.stringify(plan.body)).toString("base64"),
    });
  } catch (error) {
    // An aborted navigation can invalidate a paused request before its fixture is released.
    if (!/Invalid InterceptionId|Invalid interception|No resource with given identifier/i.test(error.message)) throw error;
  }
}
socket.addEventListener("message", ({ data }) => {
  const event = JSON.parse(data);
  if (event.method === "Runtime.exceptionThrown") exceptions.push(event.params.exceptionDetails);
  if (event.method === "Network.loadingFailed" && event.params.canceled) canceledRequests.add(event.params.requestId);
  if (event.method !== "Fetch.requestPaused") return;
  const paused = event.params;
  const task = (async () => {
    const { requestId, request } = paused;
    requests.push({ method: request.method, url: request.url, headers: request.headers, body: request.postData });
    if (!["GET", "POST", "OPTIONS"].includes(request.method)) {
      blockedWrites.push(request.method);
      return send("Fetch.failRequest", { requestId, errorReason: "BlockedByClient" });
    }
    assert.equal(new URL(request.url).pathname, "/api/guestbooks", "Only the documented guestbook endpoint is expected");
    if (request.method === "OPTIONS") return fulfill(requestId, { status: 204, body: "" });
    if (request.method === "POST") {
      assert.ok(postResponsePlan, "Each POST must have an explicit fixture response");
      const body = JSON.parse(request.postData);
      assert.deepEqual(Object.keys(body).sort(), ["content", "teamId", "writer"]);
      assert.ok(composeTeamLabels.includes(body.teamId), "Only everyone and the supplied twelve teams may receive a POST");
      const header = Object.entries(request.headers).find(([name]) => name.toLowerCase() === "content-type")?.[1];
      assert.equal(header, "application/json");
      if (holdPostResponses) heldPostRequests.push(paused);
      else await fulfill(requestId, postResponsePlan);
      return;
    }
    if (holdResponses) heldRequests.push(paused);
    else await fulfill(requestId, responsePlan);
  })();
  handlers.add(task);
  task.catch((error) => interceptionErrors.push(error.message)).finally(() => handlers.delete(task));
});
async function releaseHeld(plan = responsePlan) {
  const paused = heldRequests;
  heldRequests = [];
  await Promise.all(paused.map(({ requestId }) => fulfill(requestId, plan)));
}
async function releaseHeldPosts(plan = postResponsePlan) {
  const paused = heldPostRequests;
  heldPostRequests = [];
  await Promise.all(paused.map(({ requestId }) => fulfill(requestId, plan)));
}
function posts() {
  return requests.filter(({ method }) => method === "POST");
}
async function fill(selector, text) {
  await click(selector);
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "a", code: "KeyA", windowsVirtualKeyCode: 65, modifiers: 2 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "a", code: "KeyA", windowsVirtualKeyCode: 65, modifiers: 2 });
  await send("Input.insertText", { text });
}
async function chooseTeam(label) {
  await click(combo);
  await waitFor(isOpen);
  const index = await evaluate(`Array.from(document.querySelectorAll(${JSON.stringify(options)})).findIndex(option => option.textContent.trim() === ${JSON.stringify(label)})`);
  assert.ok(index >= 0, `Compose team missing: ${label}`);
  await click(`${options}:nth-child(${index + 1})`);
  await waitFor(`!(${isOpen})`);
}
async function visit(search = "") {
  const before = await evaluate("performance.timeOrigin");
  await send("Page.navigate", { url: `${appUrl}/guestbook${search}` });
  await waitFor(`performance.timeOrigin !== ${before} && !!document.querySelector('section button[aria-haspopup="dialog"]')`);
}
async function expectCards(expected) {
  await waitFor(`!!document.querySelector(${JSON.stringify(list)})`);
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll(${JSON.stringify(`${list} > li`)}), item => Array.from(item.querySelectorAll('p'), paragraph => paragraph.textContent)).filter(card => card.length)`),
    expected.map((entry) => [`To. ${entry.teamId || "수신 팀 미지정"}`, entry.content, `From. ${entry.writer}`]));
}
async function clickFilter(label) {
  const index = await evaluate(`Array.from(document.querySelectorAll('section [role=group] button')).findIndex(button => button.textContent.trim() === ${JSON.stringify(label)})`);
  assert.ok(index >= 0, `Filter missing: ${label}`);
  await click(`section [role="group"] button:nth-of-type(${index + 1})`);
}
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
const timeout = setTimeout(async () => {
  console.error("Browser check timed out");
  await send("Page.navigate", { url: "about:blank" });
  process.exit(1);
}, 90000);
try {
  assert.ok(["127.0.0.1", "localhost"].includes(new URL(appUrl).hostname), "Run fixtures only against the local app");
  await send("Runtime.enable");
  await send("Network.enable");
  // Every fetch is intercepted; backend writes can never reach a real service in this check.
  await send("Fetch.enable", { patterns: [{ urlPattern: "*", resourceType: "Fetch" }, { urlPattern: "https://feetfit-love.store/*" }] });
  await send("Emulation.setDeviceMetricsOverride", { width: 393, height: 852, deviceScaleFactor: 1, mobile: false });
  await visit();
  await waitFor("document.querySelector('section [role=status]')?.textContent === '방명록을 불러오는 중입니다.'");
  assert.equal(await evaluate(`!!document.querySelector(${JSON.stringify(list)})`), false, "Loading must not show fake or empty cards");
  holdResponses = false;
  await releaseHeld();
  await expectCards(entries);
  assert.deepEqual(await evaluate("Array.from(document.querySelectorAll('section [role=group] button'), button => button.textContent.trim())"), ["전체", "모두에게", ...teamLabels]);
  assert.equal(await evaluate("document.querySelector('main').textContent.includes('팀 01')"), false);
  assert.equal(await evaluate(`(() => {
    const track = document.querySelector('section [role=group]');
    const frame = document.querySelector('.app-frame').getBoundingClientRect();
    const scroll = track.parentElement.getBoundingClientRect();
    return Math.abs(scroll.left - frame.left) < 1 && Math.abs(scroll.width - frame.width) < 1
      && Math.abs(track.querySelector('button').getBoundingClientRect().left - scroll.left - 20) < 1;
  })()`), true, "Full-width filter retains 20px starting padding");
  for (const [label, teamId] of [["모두에게", "모두에게"], ["수신 팀 미지정", ""], ["새로운 외부 팀", "새로운 외부 팀"]]) {
    await clickFilter(label);
    await expectCards(entries.filter((entry) => entry.teamId === teamId));
  }
  await clickFilter("전체");
  await expectCards(entries);

  await click('section button[aria-haspopup="dialog"]');
  await waitFor(`!!document.querySelector(${JSON.stringify(combo)})`);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(submit)}).disabled`), false);
  await click(combo);
  await waitFor(isOpen);
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll(${JSON.stringify(options)}), option => option.textContent.trim())`), composeTeamLabels,
    "Compose offers everyone first and the twelve teams, without the all filter or unknown response teams");
  const geometry = await evaluate(`(() => {
    const field = document.querySelector(${JSON.stringify(combo)}).getBoundingClientRect();
    const element = document.querySelector('[role=listbox]');
    const panel = element.parentElement.getBoundingClientRect();
    return { width: panel.width - field.width, top: panel.top - field.bottom,
      radius: getComputedStyle(element.parentElement).borderRadius,
      optionHeight: element.firstElementChild.getBoundingClientRect().height,
      optionPadding: getComputedStyle(element.firstElementChild).paddingLeft };
  })()`);
  assert.ok(Math.abs(geometry.width) < 1 && Math.abs(geometry.top) < 1, JSON.stringify(geometry));
  assert.equal(geometry.radius, "22px");
  assert.equal(geometry.optionHeight, 40);
  assert.equal(geometry.optionPadding, "26px");
  await click(`${options}:nth-child(4)`);
  await waitFor(`!(${isOpen})`);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).textContent.trim()`), composeTeamLabels[3]);
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
  assert.equal(await evaluate("!!document.querySelector('dialog[open]')"), true);
  await key("ArrowDown", 40);
  await waitFor(isOpen);
  await key("ArrowDown", 40);
  await key("Enter", 13);
  await waitFor(`!(${isOpen})`);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).textContent.trim()`), composeTeamLabels[4]);
  await key("ArrowUp", 38);
  await waitFor(isOpen);
  await key("ArrowUp", 38);
  await key("Enter", 13);
  await waitFor(`!(${isOpen})`);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).textContent.trim()`), composeTeamLabels[3]);
  await click(combo);
  await waitFor(isOpen);
  await click("dialog[open] h2");
  await waitFor(`!(${isOpen})`);
  await key("Escape", 27);
  await waitFor("!document.querySelector('dialog[open]')");
  await expectCards(entries);

  // Validate blanks and missing recipients before any intercepted POST is permitted.
  await click('section button[aria-haspopup="dialog"]');
  await waitFor(`!!document.querySelector(${JSON.stringify(combo)})`);
  await fill(content, "응원 메시지");
  await fill(author, "관람객");
  await click(submit);
  await waitFor("document.querySelector('dialog[open] [role=alert]')?.textContent.includes('팀을 선택')");
  assert.equal(posts().length, 0);
  const selectedTeam = "모두에게";
  await chooseTeam(selectedTeam);
  await fill(author, "   ");
  await click(submit);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(author)}).validity.valid`), false);
  assert.equal(posts().length, 0);
  await fill(author, "  Browser writer  ");
  await fill(content, "   ");
  await click(submit);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(content)}).validity.valid`), false);
  assert.equal(posts().length, 0);
  await fill(content, "응".repeat(500));
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(content)}).value.length`), 500);
  assert.equal(await evaluate("document.querySelector('dialog[open] textarea + p').textContent.trim()"), "500/500");
  await fill(content, "  첫 응원\n두 번째 줄  ");

  const savedEntry = { id: 901, teamId: selectedTeam, writer: "서버 작성자", content: "서버가 저장한 응원", createdAt: "2026-10-01T11:00:00" };
  postResponsePlan = success(savedEntry);
  responsePlan = success([savedEntry, ...entries]);
  await click(submit);
  await waitFor("document.querySelector('dialog[open] form')?.getAttribute('aria-busy') === 'true'");
  await waitFor("document.querySelector('dialog[open] button[type=submit]')?.textContent.includes('저장 중')");
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert.equal(posts().length, 1);
  assert.deepEqual(JSON.parse(posts()[0].body), { teamId: selectedTeam, writer: "Browser writer", content: "첫 응원\n두 번째 줄" });
  for (const selector of [combo, author, content, submit]) {
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(selector)}).matches(':disabled')`), true, selector);
  }
  await click(submit);
  await evaluate("document.querySelector('dialog[open] form').requestSubmit()");
  await key("Escape", 27);
  assert.equal(await evaluate("!!document.querySelector('dialog[open]')"), true, "Pending requests retain their form");
  assert.equal(posts().length, 1, "Double submission must not create a second POST");
  await releaseHeldPosts();
  await waitFor("!document.querySelector('dialog[open]')");
  await expectCards([savedEntry, ...entries.filter(({ teamId }) => teamId === selectedTeam)]);
  assert.equal(await evaluate("document.querySelector('section button[aria-pressed=true]').textContent.trim()"), selectedTeam);
  assert.ok(await evaluate("document.querySelector('section [role=status]')?.textContent.length > 0"), "Saving announces success");
  await clickFilter("전체");
  await expectCards([savedEntry, ...entries]);

  // Business errors keep the draft editable and retries send the same documented request.
  await click('section button[aria-haspopup="dialog"]');
  await waitFor(`!!document.querySelector(${JSON.stringify(combo)})`);
  await chooseTeam("가디언즈");
  await fill(author, "재시도 작성자");
  await fill(content, "실패해도 남아 있는 초안");
  const failedDraft = { teamId: "가디언즈", writer: "재시도 작성자", content: "실패해도 남아 있는 초안" };
  const failureMessage = "teamId는 등록된 12개 팀명 중 하나와 정확히 일치해야 합니다.";
  postResponsePlan = { status: 400, body: { isSuccess: false, code: "GUESTBOOK4001", message: failureMessage } };
  holdPostResponses = false;
  const readsBeforeFailure = requests.filter(({ method }) => method === "GET").length;
  await click(submit);
  await waitFor(`document.querySelector('dialog[open] [role=alert]')?.textContent === ${JSON.stringify(failureMessage)}`);
  assert.equal(posts().length, 2);
  assert.deepEqual(JSON.parse(posts()[1].body), failedDraft);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(author)}).value`), failedDraft.writer);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(content)}).value`), failedDraft.content);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).textContent.trim()`), failedDraft.teamId);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(submit)}).disabled`), false);
  assert.equal(requests.filter(({ method }) => method === "GET").length, readsBeforeFailure, "Failed writes do not reload or alter the list");
  const retriedEntry = { id: 902, ...failedDraft, createdAt: "2026-10-01T11:01:00" };
  postResponsePlan = success(retriedEntry);
  responsePlan = success([retriedEntry, savedEntry, ...entries]);
  await click(submit);
  await waitFor("!document.querySelector('dialog[open]')");
  await expectCards([retriedEntry]);
  assert.equal(posts().length, 3);
  assert.deepEqual(JSON.parse(posts()[2].body), failedDraft);
  responsePlan = success(entries);
  await visit();
  await expectCards(entries);

  await clickFilter("새로운 외부 팀");
  await new Promise((resolve) => setTimeout(resolve, 400));
  await checkIndicator();
  assert.equal(await evaluate(`(() => {
    const track = document.querySelector('section [role=group]');
    const scroller = track.parentElement;
    scroller.scrollLeft = scroller.scrollWidth;
    return Math.abs(scroller.getBoundingClientRect().right - track.querySelector('button:last-of-type').getBoundingClientRect().right - 20) < 1;
  })()`), true);
  assert.equal(await evaluate(`(() => {
    const scroller = document.querySelector('section [role=group]').parentElement;
    const before = scroller.scrollLeft;
    scroller.scrollLeft = Math.max(0, before - 25);
    return before > 0 && scroller.scrollLeft < before;
  })()`), true);
  await checkIndicator();

  for (const [search, label, teamId] of [
    [`?teamId=${encodeURIComponent("새로운 외부 팀")}`, "새로운 외부 팀", "새로운 외부 팀"],
    [`?teamId=${encodeURIComponent("아직 글 없는 팀")}`, "아직 글 없는 팀", "아직 글 없는 팀"],
    [`?teamId=${encodeURIComponent("모두에게")}`, "모두에게", "모두에게"],
    ["?teamId=", "수신 팀 미지정", ""],
    ["?projectId=project-1", "팀 01", "팀 01"],
    ["?projectId=invalid-project", "전체", null],
  ]) {
    await visit(search);
    await expectCards(teamId === null ? entries : entries.filter((entry) => entry.teamId === teamId));
    assert.equal(await evaluate("document.querySelector('section button[aria-pressed=true]').textContent.trim()"), label);
    await click('section button[aria-haspopup="dialog"]');
    await waitFor(`!!document.querySelector(${JSON.stringify(combo)})`);
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(combo)}).textContent.trim()`), teamId === "모두에게" ? "모두에게" : "응원할 팀을 선택해주세요",
      "Everyone is writable; unknown, blank, and legacy recipients still require a selection");
    await key("Escape", 27);
    await waitFor("!document.querySelector('dialog[open]')");
  }
  // Hold track width above its content width to detect position changes after async team insertion.
  holdResponses = true;
  await visit(`?teamId=${encodeURIComponent("나")}`);
  await waitFor("document.querySelector('section [role=status]')?.textContent === '방명록을 불러오는 중입니다.'");
  await evaluate("document.querySelector('section [role=group]').style.minWidth = '2400px'");
  await new Promise((resolve) => setTimeout(resolve, 400));
  await checkIndicator();
  const selectedLeftBefore = await evaluate("document.querySelector('section button[aria-pressed=true]').offsetLeft");
  const trackWidthBefore = await evaluate("document.querySelector('section [role=group]').getBoundingClientRect().width");
  const delayedEntries = entries.slice(0, 2).map((entry, index) => ({ ...entry, teamId: index === 0 ? "가" : "나" }));
  holdResponses = false;
  await releaseHeld(success(delayedEntries));
  await expectCards(delayedEntries.filter(({ teamId }) => teamId === "나"));
  await new Promise((resolve) => setTimeout(resolve, 400));
  assert.ok(await evaluate(`document.querySelector('section button[aria-pressed=true]').offsetLeft > ${selectedLeftBefore}`));
  assert.equal(await evaluate("document.querySelector('section [role=group]').getBoundingClientRect().width"), trackWidthBefore);
  await checkIndicator();

  responsePlan = success([]);
  await visit();
  await expectCards([]);
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(list)}).textContent.includes('아직 등록된 방명록이 없습니다')`), true);
  const errorCases = [
    [{ status: 503, body: { message: "서버 점검 중입니다." } }, "서버 점검 중입니다."],
    [{ status: 200, body: { isSuccess: false, code: "DENIED", message: "조회할 수 없습니다." } }, "조회할 수 없습니다."],
    [success([{ ...entries[0], writer: 123 }]), "방명록 응답 형식이 올바르지 않습니다."],
    [{ status: 200, body: { result: entries } }, "서버 응답 형식이 올바르지 않습니다."],
    [{ status: 200, contentType: "text/html", body: "<html>Unavailable</html>" }, "서버 응답을 읽을 수 없습니다."],
    [{ networkError: true }, "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요."],
  ];
  for (const [failure, message] of errorCases) {
    responsePlan = failure;
    await visit(`?teamId=${encodeURIComponent("별빛")}`);
    await waitFor(`document.querySelector('section [role=alert]')?.textContent === ${JSON.stringify(message)}`);
    assert.equal(await evaluate(`!!document.querySelector(${JSON.stringify(list)})`), false);
    responsePlan = success(entries);
    await click('section [role="alert"] + button');
    await expectCards(entries.filter(({ teamId }) => teamId === "별빛"));
  }

  // A save during the initial GET must win over its late, stale response.
  holdResponses = true;
  await visit();
  await waitFor("document.querySelector('section [role=status]')?.textContent === '방명록을 불러오는 중입니다.'");
  await click('section button[aria-haspopup="dialog"]');
  await waitFor(`!!document.querySelector(${JSON.stringify(combo)})`);
  await chooseTeam("가디언즈");
  await fill(author, "경합 검사 작성자");
  await fill(content, "늦은 조회에도 유지될 글");
  const raceEntry = { id: 903, teamId: "가디언즈", writer: "경합 검사 작성자", content: "늦은 조회에도 유지될 글", createdAt: "2026-10-01T11:02:00" };
  postResponsePlan = success(raceEntry);
  responsePlan = success([raceEntry, ...entries]);
  holdResponses = false;
  await click(submit);
  await waitFor("!document.querySelector('dialog[open]')");
  await expectCards([raceEntry]);
  await releaseHeld(success(entries));
  await new Promise((resolve) => setTimeout(resolve, 150));
  await expectCards([raceEntry]);
  assert.equal(posts().length, 4);

  holdResponses = true;
  await visit();
  await waitFor("document.querySelector('section [role=status]')?.textContent === '방명록을 불러오는 중입니다.'");
  const pausedNetworkIds = heldRequests.map(({ networkId }) => networkId).filter(Boolean);
  await click('.navbar a[href="/home"]');
  await waitFor("location.pathname === '/home' && document.querySelector('main h1')?.textContent === '2026 WISCOM'");
  holdResponses = false;
  await releaseHeld(success([{ ...entries[0], content: "STALE RESPONSE" }]));
  assert.ok(pausedNetworkIds.some((id) => canceledRequests.has(id)), "Leaving the page must abort the paused GET");
  responsePlan = success(entries);
  await visit();
  await expectCards(entries);
  await Promise.all(handlers);
  assert.deepEqual(blockedWrites, [], "Only documented GET/POST operations are allowed");
  assert.deepEqual(interceptionErrors, []);
  assert.deepEqual(exceptions, []);
  assert.ok(requests.some(({ method }) => method === "GET"));
  console.log("PASS: intercepted GET states/filters/URLs/retries/abort, exact team catalog, POST validation/body/headers/pending/success/error/retry/GET race, dropdown keyboard/geometry and filter scrolling; no live writes");
} finally {
  clearTimeout(timeout);
  // Abort the local page before releasing interception, even if an assertion failed with a POST paused.
  await send("Page.navigate", { url: "about:blank" });
  await send("Fetch.disable");
  socket.close();
}
