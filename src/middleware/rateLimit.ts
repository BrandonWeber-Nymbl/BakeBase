import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for key provisioning endpoints.
 * Prevents DoS via unlimited API key generation.
 * 5 requests per 15 minutes per IP.
 */
export const keyProvisioningLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: 'Too many API key requests. Please try again later.',
    meta: {
      endpoint_description: 'Rate limit exceeded. Try again in 15 minutes.',
      field_glossary: {}
    }
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false
});
