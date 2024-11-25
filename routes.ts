/**
 * Array of routes that are accessible to the public
 * @type {string[]}
 */
export const publicRoutes = [""];

/**
 * Array of routes that are used for authentication
 * @type {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

/**
 * preffix for API authentication routes
 * routes that starts with this preffix are used for authentication purpouses
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * the default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
/**
 * the default redirect path after is offline
 * @type {string}
 */
export const DEFAULT_OFFLINE_REDIRECT = "/offline";
