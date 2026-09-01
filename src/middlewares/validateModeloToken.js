import jwt from "jsonwebtoken";
import "dotenv/config.js";

export const modeloAuthRequired = (req, res, next) => {
  const TOKEN_SECRET = `${process.env.TOKEN_SECRET}`;

  const { modeloToken } = req.cookies;
  if (!modeloToken) return res.status(401).json({ message: "No token" });

  jwt.verify(modeloToken, TOKEN_SECRET, (err, modelo) => {
    if (err) return res.status(403).json({ message: "InvalidToken" });
    req.modelo = modelo;
    next();
  });
};