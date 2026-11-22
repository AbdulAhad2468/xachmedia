import { isIP } from "node:net";

// Failed sends release their submission slot; a broader attempt cap still limits abuse.
export function createContactRateLimiter({ now = Date.now, windowMs = 600_000, maxSubmissions = 5, maxAttempts = 30, maxBuckets = 2_000 } = {}) {
  const visitors = new Map();
  const attempts = new Map();
  const retryAfter = (expiresAt, time) => Math.max(1, Math.ceil((expiresAt - time) / 1000));
  return (request, payload) => {
    const time = now();
    for (const [key, visitor] of visitors) {
      for (const [id, slot] of visitor) if (slot.expiresAt <= time) visitor.delete(id);
      if (!visitor.size) visitors.delete(key);
    }
    for (const [key, bucket] of attempts) if (bucket.expiresAt <= time) attempts.delete(key);
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const real = request.headers.get("x-real-ip")?.trim();
    const ip = isIP(forwarded || "") ? forwarded : isIP(real || "") ? real : "";
    const email = payload.email.toLowerCase();
    const attemptKey = ip || email;
    const visitorKey = `${ip}|${email}`;
    let attemptBucket = attempts.get(attemptKey);
    if (attemptBucket && attemptBucket.count >= maxAttempts) return { allowed: false, retryAfter: retryAfter(attemptBucket.expiresAt, time) };
    if (!attemptBucket) {
      if (attempts.size >= maxBuckets) return { allowed: false, retryAfter: 60 };
      attemptBucket = { count: 0, expiresAt: time + windowMs };
      attempts.set(attemptKey, attemptBucket);
    }
    attemptBucket.count += 1;
    let visitor = visitors.get(visitorKey);
    // Retry an already reserved or accepted brief without charging a second slot.
    if (visitor?.has(payload.submissionId)) return { allowed: true, commit() {}, release() {} };
    if (visitor && visitor.size >= maxSubmissions) {
      return { allowed: false, retryAfter: retryAfter(Math.min(...Array.from(visitor.values(), slot => slot.expiresAt)), time) };
    }
    if (!visitor) {
      if (visitors.size >= maxBuckets) return { allowed: false, retryAfter: 60 };
      visitor = new Map();
      visitors.set(visitorKey, visitor);
    }
    const slot = { expiresAt: time + windowMs, accepted: false };
    visitor.set(payload.submissionId, slot);
    return {
      allowed: true,
      commit() { slot.accepted = true; },
      release() {
        if (!slot.accepted && visitor.get(payload.submissionId) === slot) visitor.delete(payload.submissionId);
        if (!visitor.size && visitors.get(visitorKey) === visitor) visitors.delete(visitorKey);
      },
    };
  };
}
