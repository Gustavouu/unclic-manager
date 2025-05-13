
// Simple in-memory rate limiter store
// In production, use Redis or another persistent store
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_STORE: Map<string, Record<string, RateLimitRecord>> = new Map();

// Rate limit configuration by route pattern
const RATE_LIMIT_CONFIG: Record<string, { limit: number, window: number }> = {
  '/auth': { limit: 10, window: 60 * 1000 }, // 10 requests per minute
  '/password-reset': { limit: 5, window: 5 * 60 * 1000 }, // 5 requests per 5 minutes
  '/payment': { limit: 20, window: 60 * 1000 }, // 20 requests per minute
  'default': { limit: 100, window: 60 * 1000 } // Default: 100 requests per minute
};

/**
 * Middleware for rate limiting requests based on IP address and route
 */
export async function rateLimitMiddleware(
  request: Request, 
  ip: string = 'unknown'
): Promise<{ allowed: boolean; headers: Record<string, string>; retryAfter?: number }> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Skip rate limiting for non-API routes and static assets
  if (!path.startsWith('/api/') || 
      path.includes('/assets/') || 
      path.includes('/static/') ||
      request.method === 'OPTIONS') {
    return { allowed: true, headers: {} };
  }

  // Get appropriate rate limit config for this route
  let config = RATE_LIMIT_CONFIG.default;
  
  // Find matching route config
  for (const route in RATE_LIMIT_CONFIG) {
    if (route !== 'default' && path.includes(route)) {
      config = RATE_LIMIT_CONFIG[route];
      break;
    }
  }
  
  // Get or initialize store for this IP
  if (!RATE_LIMIT_STORE.has(ip)) {
    RATE_LIMIT_STORE.set(ip, {});
  }
  
  const ipStore = RATE_LIMIT_STORE.get(ip)!;
  
  // Get or initialize record for this route
  if (!ipStore[path]) {
    ipStore[path] = {
      count: 0,
      resetTime: Date.now() + config.window
    };
  }
  
  const record = ipStore[path];
  
  // Reset counter if window has passed
  if (Date.now() > record.resetTime) {
    record.count = 0;
    record.resetTime = Date.now() + config.window;
  }
  
  // Check if limit is reached
  if (record.count >= config.limit) {
    // Clean up old records occasionally (1% chance)
    if (Math.random() < 0.01) {
      cleanupOldRecords();
    }
    
    // Return rate limit exceeded response
    return {
      allowed: false,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': config.limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil(record.resetTime / 1000).toString(),
        'Retry-After': Math.ceil((record.resetTime - Date.now()) / 1000).toString()
      },
      retryAfter: Math.ceil((record.resetTime - Date.now()) / 1000)
    };
  }
  
  // Increment counter
  record.count++;
  
  // Add rate limit headers to response
  return {
    allowed: true,
    headers: {
      'X-RateLimit-Limit': config.limit.toString(),
      'X-RateLimit-Remaining': (config.limit - record.count).toString(),
      'X-RateLimit-Reset': Math.ceil(record.resetTime / 1000).toString()
    }
  };
}

// Helper function to clean up old records
function cleanupOldRecords() {
  const now = Date.now();
  
  RATE_LIMIT_STORE.forEach((routes, ip) => {
    Object.entries(routes).forEach(([path, record]) => {
      if (now > record.resetTime) {
        delete routes[path];
      }
    });
    
    // If no more routes for this IP, remove the IP entry
    if (Object.keys(routes).length === 0) {
      RATE_LIMIT_STORE.delete(ip);
    }
  });
}
