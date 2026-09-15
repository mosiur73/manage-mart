// In-memory fixed-window rate limiter.
//
// Good enough for local dev / a single-process deployment. It is NOT correct
// across multiple serverless instances (each instance has its own memory, so
// the real limit becomes limit × instance-count) — a real multi-instance
// deployment needs a shared store (Upstash Redis or similar). Documented as a
// deliberate scope call, not an oversight — see IMPLEMENTATION_PLAN.md Phase 5.

const buckets = new Map()

function sweepExpired() {
  const now = Date.now()
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key)
  }
}

/**
 * @param {string} key - unique identity for the caller (e.g. `checkout:${userId}`)
 * @param {{ limit: number, windowMs: number }} options
 * @returns {{ allowed: boolean, retryAfterMs?: number }}
 */
export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now()
  if (buckets.size > 5000) sweepExpired()

  const bucket = buckets.get(key)
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now }
  }

  bucket.count += 1
  return { allowed: true }
}
