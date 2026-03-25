import jwt from "jsonwebtoken";

export function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.warn(`Auth failed: No token provided. Cookies received: ${JSON.stringify(req.cookies)}`);
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      console.error("Auth failed: Token decoded but missing ID.", decoded);
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        err: "Invalid token structure",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth failed: JWT verification error.", err.message);
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Invalid token",
    });
  }
}
