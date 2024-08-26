import jwt from "jsonwebtoken";
import 'dotenv/config.js'


export const authRequired = (req, res, next) => {
  const TOKEN_SECRET = `${process.env.TOKEN_SECRET}`;

  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "InvalidToken" });
    req.user = user
    next();
  });
};