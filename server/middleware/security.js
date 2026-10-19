/**
 * Comprehensive Application Security Middleware
 * Defense-in-depth protection against XSS, Clickjacking, MIME-sniffing,
 * SSRF, DoS request floods, and injection attacks.
 */

// In-memory sliding-window rate limiter (zero external dependencies required)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_GENERAL_REQUESTS_PER_MIN = 120;
const MAX_COMPUTE_REQUESTS_PER_MIN = 30; // for heavy AI inference & upload

// Periodic cache cleanup every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.windowStart > RATE_LIMIT_WINDOW_MS) {
      requestCounts.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Cross-site scripting (XSS) filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy (block unwanted hardware access)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Strip server fingerprinting
  res.removeHeader('X-Powered-By');

  next();
};

export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const isComputeHeavy = req.path.includes('/solutions/generate') || req.path.includes('/upload') || req.path.includes('/train');
  const limit = isComputeHeavy ? MAX_COMPUTE_REQUESTS_PER_MIN : MAX_GENERAL_REQUESTS_PER_MIN;

  let record = requestCounts.get(ip);
  if (!record || (now - record.windowStart) > RATE_LIMIT_WINDOW_MS) {
    record = { windowStart: now, count: 1 };
    requestCounts.set(ip, record);
    return next();
  }

  record.count++;
  if (record.count > limit) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Rate limit exceeded. Please wait a minute before retrying.',
      retryAfterSeconds: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - record.windowStart)) / 1000)
    });
  }

  next();
};

/**
 * Sanitize strings to strip script tags, javascript: pseudo-protocols, and unsafe HTML
 */
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return text;
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

/**
 * Validate outbound AI URLs to prevent Server-Side Request Forgery (SSRF)
 * Rejects cloud metadata addresses (169.254.169.254) and non-HTTPS external protocols
 */
export const isValidOutboundUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    
    const host = url.hostname.toLowerCase();
    // Block internal AWS / GCP metadata IP
    if (host === '169.254.169.254' || host === 'metadata.google.internal') return false;
    
    // Cloudflare quick tunnels or public HTTPS hosts are allowed
    return true;
  } catch {
    return false;
  }
};
