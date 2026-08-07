import ApiError from "../utils/ApiError.js";
import { verifyToken, findAdminById } from "../services/auth.service.js";

/**
 * Authentication middleware.
 * Extracts the JWT from the Authorization header (Bearer token) or
 * from the httpOnly cookie, verifies it, and attaches the admin
 * payload to `req.admin`.
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header or cookie
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new ApiError(401, "Authentication required. Please log in.");
    }

    // 2. Verify & decode the token
    const decoded = verifyToken(token);

    // 3. Confirm admin still exists in the database
    const admin = await findAdminById(decoded.id);
    if (!admin) {
      throw new ApiError(401, "Admin account no longer exists");
    }

    // 4. Attach admin to the request object for downstream use
    req.admin = { id: admin.id, email: admin.email, name: admin.name };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    // jwt.verify throws errors like "jwt expired", "invalid token" etc.
    return next(new ApiError(401, "Invalid or expired token. Please log in again."));
  }
};

export default authMiddleware;
