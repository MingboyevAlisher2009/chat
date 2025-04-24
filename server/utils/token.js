import jwt from "jsonwebtoken";

export const generateToken = (email, userId) => {
  try {
    const token = jwt.sign({ email, userId }, process.env.JWT_KEY, {
      expiresIn: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
  } catch (error) {
    return new Error(error);
  }
};

export const verifyToken = (res, token) => {
  try {
    if (!token) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    console.error("JWT verification error:", error);
    return new Error("Invalid token");
  }
};
