import { createHash } from "node:crypto";
import { createContactRateLimiter } from "./contact-rate-limit.mjs";

const SERVICE_NAMES = new Set([
  "Social media management",
  "Reels & content creation",
  "Online business presence",
  "Strategy & page growth",
]);

const MAX_BODY_BYTES = 16_384;
const allowRequest = createContactRateLimiter();
const pendingDeliveries = new Map();

const respond = (body, status = 200, headers = {}) => Response.json(body, {
  status,
  headers: { "Cache-Control": "no-store", ...headers },
});

const isEmail = value => typeof value === "string" && value.length <= 254 &&
  /^[^@\s<>(),;:"\\[\]]+@(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,63}$/i.test(value);

const escapeHtml = value => value.replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

async function readPayload(request) {
  if (!request.body) throw new Error("Invalid JSON");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        const error = new Error("Payload too large");
        error.status = 413;
        throw error;
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    reader.releaseLock();
  }
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const limits = { name: 100, business: 150, email: 254, page: 300, goal: 3_000 };
  const cleaned = {};
  for (const [field, maximum] of Object.entries(limits)) {
    const value = payload[field] ?? (field === "page" ? "" : null);
    if (typeof value !== "string" || value.length > maximum || (field !== "page" && !value.trim())) return null;
    cleaned[field] = value.trim();
  }
  if (!isEmail(cleaned.email) || /[\r\n]/.test(cleaned.name + cleaned.business)) return null;
  if (payload.company_url !== undefined && payload.company_url !== "") return null;
  if (!Array.isArray(payload.services) || payload.services.length > SERVICE_NAMES.size || payload.services.some(service => !SERVICE_NAMES.has(service))) return null;
  if (typeof payload.submissionId !== "string" || !/^[a-z\d-]{16,80}$/i.test(payload.submissionId)) return null;
  cleaned.services = [...new Set(payload.services)];
  cleaned.submissionId = payload.submissionId;
  return cleaned;
}

export function createEnquiryEmail(enquiry, { from, to }) {
  const interests = enquiry.services.join(", ") || "Help choosing the right service";
  const rows = [
    ["Name", enquiry.name], ["Business", enquiry.business], ["Email", enquiry.email],
    ["Interested in", interests], ["Current page", enquiry.page || "Not shared"],
  ];
  const text = ["New Xach Media website enquiry", "", ...rows.map(([label, value]) => `${label}: ${value}`), "", "Project goal:", enquiry.goal].join("\n");
  const htmlRows = rows.map(([label, value]) => `<tr><td style="padding:10px 0;vertical-align:top;width:120px;color:#766a82;font-size:14px">${label}</td><td style="padding:10px 0;color:#271c33;font-size:14px;word-break:break-word">${escapeHtml(value)}</td></tr>`).join("");
  const html = `<div style="background:#f5f1fa;padding:32px 16px;font-family:Arial,sans-serif"><div style="max-width:600px;margin:auto;background:#fff;border:1px solid #e5dceb;border-radius:14px;overflow:hidden"><div style="padding:28px;background:#1d1229;color:#e7cfff"><strong style="font-size:22px">Xach Media</strong><p style="margin:10px 0 0;font-size:14px;color:#c9b2dc">A new conversation starts here.</p></div><div style="padding:28px"><h1 style="margin:0 0 20px;font-size:24px;color:#24172f">New project enquiry</h1><table role="presentation" style="width:100%;border-collapse:collapse">${htmlRows}</table><h2 style="margin:26px 0 12px;color:#24172f;font-size:17px">Project goal</h2><div style="padding:18px;border:1px solid #e7ddec;border-radius:8px;color:#42334f;font-size:15px;line-height:1.7;word-break:break-word">${escapeHtml(enquiry.goal).replace(/\n/g, "<br />")}</div><p style="margin:22px 0 0;color:#766a82;font-size:13px;line-height:1.7">Reply to this email to contact the visitor directly.</p></div></div></div>`;
  return {
    from: `Xach Media <${from}>`,
    to: [to],
    reply_to: enquiry.email,
    subject: `New project enquiry — ${enquiry.business}`,
    text,
    html,
  };
}

// Dependencies are injectable so checks never need credentials or real emails.
export async function handleContactRequest(request, {
  env = process.env,
  fetchImpl = globalThis.fetch,
  rateLimit = allowRequest,
  logger = console,
  inFlight = pendingDeliveries,
} = {}) {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site") return respond({ error: "Please send your enquiry from the Xach Media website." }, 403);
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) return respond({ error: "Please send your enquiry from the Xach Media website." }, 403);
    } catch {
      return respond({ error: "Invalid request origin." }, 403);
    }
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return respond({ error: "Please send a valid project brief." }, 415);
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return respond({ error: "Your brief is too long. Please shorten it and try again." }, 413);

  let payload;
  try {
    payload = validatePayload(await readPayload(request));
  } catch (error) {
    return respond({ error: error.status === 413 ? "Your brief is too long. Please shorten it and try again." : "Please send a valid project brief." }, error.status === 413 ? 413 : 400);
  }
  if (!payload) return respond({ error: "Please check your name, business, email, and project details, then try again." }, 400);

  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.RESEND_FROM_EMAIL?.trim();
  const to = env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !isEmail(from) || !isEmail(to)) {
    logger.error("Contact email configuration is incomplete.");
    return respond({ error: "Email sending is temporarily unavailable. Please use WhatsApp or the email draft below." }, 503);
  }
  const email = createEnquiryEmail(payload, { from, to });
  const deliveryKey = `${payload.submissionId}/${createHash("sha256").update(JSON.stringify(email)).digest("hex")}`;
  if (inFlight.has(deliveryKey)) return (await inFlight.get(deliveryKey)).clone();
  const reservation = rateLimit(request, payload);
  if (reservation === false || reservation?.allowed === false) {
    const seconds = reservation?.retryAfter || 600;
    const minutes = Math.max(1, Math.ceil(seconds / 60));
    return respond({ error: `Please wait about ${minutes} minute${minutes === 1 ? "" : "s"} before sending another enquiry, or contact us on WhatsApp.` }, 429, { "Retry-After": String(seconds) });
  }

  const send = async () => { try {
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `xach-contact/${payload.submissionId}`,
      },
      body: JSON.stringify(email),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || typeof result?.id !== "string" || !result.id) {
      reservation?.release?.();
      logger.error("Contact email provider rejected the request.", { status: response.status });
      return respond({ error: "We couldn’t send your brief right now. Please try again or use WhatsApp or the email draft below." }, 502);
    }
    // Acceptance by Resend is confirmed here; inbox delivery is not claimed.
    reservation?.commit?.();
    return respond({ success: true, reference: result.id, message: "Your enquiry has been sent to Xach Media. Thank you for getting in touch." });
  } catch {
    reservation?.release?.();
    logger.error("Contact email provider request failed.");
    return respond({ error: "We couldn’t confirm your email was sent. Please retry, or contact us on WhatsApp. Your brief is still available below." }, 502);
  } };
  const delivery = send();
  inFlight.set(deliveryKey, delivery);
  try {
    return (await delivery).clone();
  } finally {
    if (inFlight.get(deliveryKey) === delivery) inFlight.delete(deliveryKey);
  }
}
