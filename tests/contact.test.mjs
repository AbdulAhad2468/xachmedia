import test from "node:test";
import assert from "node:assert/strict";
import { createEnquiryEmail, handleContactRequest } from "../lib/contact.mjs";
import { createContactRateLimiter } from "../lib/contact-rate-limit.mjs";

const env = {
  RESEND_API_KEY: "re_test_key_not_a_real_secret",
  RESEND_FROM_EMAIL: "info@xachmedia.com",
  CONTACT_TO_EMAIL: "info@xachmedia.com",
};
const payload = {
  name: "Taylor Example", business: "Example Studio", email: "taylor@example.com",
  services: ["Reels & content creation"], page: "instagram.com/example", goal: "Create a more consistent social presence.",
  company_url: "", submissionId: "f2f3f979-021e-40aa-8d4b-b432f0159d04",
};
const request = (body = payload, headers = {}) => new Request("https://xachmedia.com/api/contact", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "https://xachmedia.com", ...headers }, body: JSON.stringify(body),
});
const dependencies = {
  env, rateLimit: () => true, logger: { error() {} },
  fetchImpl: async () => { throw new Error("A rejected request must not contact Resend"); },
};

test("sends the brief to the configured inbox with the visitor as reply-to", async () => {
  let sent;
  const result = await handleContactRequest(request({ ...payload, from: "attacker@example.com", to: "attacker@example.com" }), {
    ...dependencies,
    fetchImpl: async (url, options) => {
      sent = { url, options, body: JSON.parse(options.body) };
      return Response.json({ id: "mock-resend-id" });
    },
  });
  assert.equal(result.status, 200);
  assert.equal((await result.json()).success, true);
  assert.equal(sent.url, "https://api.resend.com/emails");
  assert.equal(sent.body.from, "Xach Media <info@xachmedia.com>");
  assert.deepEqual(sent.body.to, ["info@xachmedia.com"]);
  assert.equal(sent.body.reply_to, payload.email);
  assert.equal(sent.options.headers.Authorization, `Bearer ${env.RESEND_API_KEY}`);
  assert.equal(sent.options.headers["Idempotency-Key"], `xach-contact/${payload.submissionId}`);
  assert.match(sent.body.text, /Create a more consistent social presence/);
  assert.equal(result.headers.get("cache-control"), "no-store");
});

test("keeps the same provider payload and idempotency key when a brief is retried", async () => {
  const calls = [];
  const deps = { ...dependencies, fetchImpl: async (_url, options) => { calls.push(options); return Response.json({ id: "same-email" }); } };
  await handleContactRequest(request(), deps);
  await handleContactRequest(request(), deps);
  assert.equal(calls[0].headers["Idempotency-Key"], calls[1].headers["Idempotency-Key"]);
  assert.equal(calls[0].body, calls[1].body);
});

test("escapes visitor content in the HTML email and preserves a plain text version", () => {
  const email = createEnquiryEmail({ ...payload, business: '<img src=x onerror="alert(1)">', goal: '<script>alert("x")</script>\nA second line' }, { from: env.RESEND_FROM_EMAIL, to: env.CONTACT_TO_EMAIL });
  assert.doesNotMatch(email.html, /<script>|<img src=x/);
  assert.match(email.html, /&lt;script&gt;/);
  assert.match(email.html, /<br \/>A second line/);
  assert.match(email.text, /<script>/);
});

for (const [name, changes] of [
  ["blank name", { name: "   " }],
  ["missing business", { business: "" }],
  ["invalid email", { email: "not-an-email" }],
  ["multiple email separators", { email: "a@b@example.com" }],
  ["missing goal", { goal: "\n  " }],
  ["oversized goal", { goal: "x".repeat(3001) }],
  ["unknown service", { services: ["Not a real service"] }],
  ["non-array services", { services: "Reels" }],
  ["header injection", { business: "Example\r\nBcc: other@example.com" }],
  ["filled honeypot", { company_url: "https://spam.example.com" }],
  ["invalid submission identifier", { submissionId: "bad\r\nheader" }],
]) {
  test(`rejects ${name} before calling the email provider`, async () => {
    const result = await handleContactRequest(request({ ...payload, ...changes }), dependencies);
    assert.equal(result.status, 400);
    assert.equal(typeof (await result.json()).error, "string");
  });
}

test("rejects cross-site submission", async () => {
  const result = await handleContactRequest(request(payload, { Origin: "https://other.example.com" }), dependencies);
  assert.equal(result.status, 403);
});

test("rejects malformed JSON", async () => {
  const result = await handleContactRequest(new Request("https://xachmedia.com/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }), dependencies);
  assert.equal(result.status, 400);
});

test("rejects unsupported body format", async () => {
  const result = await handleContactRequest(request(payload, { "Content-Type": "text/plain" }), dependencies);
  assert.equal(result.status, 415);
});

test("enforces the body limit even without a Content-Length header", async () => {
  const result = await handleContactRequest(request({ ...payload, goal: "x".repeat(17000) }), dependencies);
  assert.equal(result.status, 413);
});

test("missing configuration returns a useful fallback message without claiming success", async () => {
  const result = await handleContactRequest(request(), { ...dependencies, env: {} });
  assert.equal(result.status, 503);
  const body = await result.json();
  assert.equal(body.success, undefined);
  assert.match(body.error, /WhatsApp/);
});

test("request limiting prevents another provider call and includes retry guidance", async () => {
  const result = await handleContactRequest(request(), { ...dependencies, rateLimit: () => false });
  assert.equal(result.status, 429);
  assert.equal(result.headers.get("Retry-After"), "600");
});

test("provider rejection does not leak provider response content", async () => {
  const result = await handleContactRequest(request(), { ...dependencies, fetchImpl: async () => Response.json({ message: "private provider details" }, { status: 403 }) });
  assert.equal(result.status, 502);
  assert.doesNotMatch(await result.text(), /private provider details/);
});

test("does not claim success for a provider response without an email identifier", async () => {
  const result = await handleContactRequest(request(), { ...dependencies, fetchImpl: async () => Response.json({}) });
  assert.equal(result.status, 502);
});

test("network failure preserves retry guidance without exposing internal errors", async () => {
  const result = await handleContactRequest(request(), { ...dependencies, fetchImpl: async () => { throw new Error("internal details"); } });
  assert.equal(result.status, 502);
  const body = await result.json();
  assert.match(body.error, /retry/i);
  assert.doesNotMatch(body.error, /internal details/);
});

const proxyHeaders = { "x-forwarded-for": "203.0.113.20" };
const numberedPayload = index => ({ ...payload, submissionId: `${payload.submissionId}-${index}` });

for (const failure of ["provider rejection", "network failure"]) {
  test(`${failure} does not exhaust the successful-enquiry allowance`, async () => {
    let calls = 0;
    const deps = { ...dependencies, rateLimit: createContactRateLimiter(), fetchImpl: async () => {
      calls += 1;
      if (calls <= 6) {
        if (failure === "network failure") throw new Error("connection failed");
        return Response.json({ error: "not configured yet" }, { status: 403 });
      }
      return Response.json({ id: "now-working" });
    } };
    for (let index = 0; index < 6; index += 1) {
      assert.equal((await handleContactRequest(request(numberedPayload(index), proxyHeaders), deps)).status, 502);
    }
    assert.equal((await handleContactRequest(request(numberedPayload(6), proxyHeaders), deps)).status, 200);
    assert.equal(calls, 7);
  });
}

test("retries of one accepted brief use only one submission slot", async () => {
  const deps = { ...dependencies, rateLimit: createContactRateLimiter(), fetchImpl: async () => Response.json({ id: "accepted-email" }) };
  for (let index = 0; index < 6; index += 1) assert.equal((await handleContactRequest(request(payload, proxyHeaders), deps)).status, 200);
  for (let index = 0; index < 4; index += 1) assert.equal((await handleContactRequest(request(numberedPayload(index), proxyHeaders), deps)).status, 200);
  assert.equal((await handleContactRequest(request(numberedPayload(5), proxyHeaders), deps)).status, 429);
});

test("different visitors behind one proxy have separate normal enquiry allowances", async () => {
  const deps = { ...dependencies, rateLimit: createContactRateLimiter(), fetchImpl: async () => Response.json({ id: "accepted" }) };
  for (let index = 0; index < 5; index += 1) assert.equal((await handleContactRequest(request(numberedPayload(index), proxyHeaders), deps)).status, 200);
  assert.equal((await handleContactRequest(request({ ...numberedPayload(6), email: "another@example.com" }, proxyHeaders), deps)).status, 200);
});

test("simultaneous retries share one in-flight provider request", async () => {
  let calls = 0;
  let finish;
  let started;
  const providerStarted = new Promise(resolve => { started = resolve; });
  const providerResponse = new Promise(resolve => { finish = resolve; });
  const deps = { ...dependencies, inFlight: new Map(), rateLimit: createContactRateLimiter(), fetchImpl: async () => { calls += 1; started(); return providerResponse; } };
  const first = handleContactRequest(request(payload, proxyHeaders), deps);
  await providerStarted;
  const second = handleContactRequest(request(payload, proxyHeaders), deps);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 1);
  finish(Response.json({ id: "one-provider-request" }));
  const results = await Promise.all([first, second]);
  for (const result of results) {
    assert.equal(result.status, 200);
    assert.equal((await result.json()).reference, "one-provider-request");
  }
});

test("the cooldown reports remaining seconds and expires normally", async () => {
  let clock = 1_000;
  const deps = { ...dependencies, rateLimit: createContactRateLimiter({ now: () => clock }), fetchImpl: async () => Response.json({ id: "accepted" }) };
  for (let index = 0; index < 5; index += 1) await handleContactRequest(request(numberedPayload(index), proxyHeaders), deps);
  clock += 60_000;
  const limited = await handleContactRequest(request(numberedPayload(6), proxyHeaders), deps);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "540");
  clock += 540_001;
  assert.equal((await handleContactRequest(request(numberedPayload(7), proxyHeaders), deps)).status, 200);
});

test("a separate attempt limit still bounds repeated provider failures", async () => {
  let calls = 0;
  const deps = { ...dependencies, rateLimit: createContactRateLimiter({ maxAttempts: 3 }), fetchImpl: async () => { calls += 1; throw new Error("network failure"); } };
  for (let index = 0; index < 3; index += 1) assert.equal((await handleContactRequest(request(numberedPayload(index), proxyHeaders), deps)).status, 502);
  assert.equal((await handleContactRequest(request(numberedPayload(4), proxyHeaders), deps)).status, 429);
  assert.equal(calls, 3);
});
