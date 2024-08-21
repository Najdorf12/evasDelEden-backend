import jwt from "jsonwebtoken";
import "dotenv/config.js";

export function createAccessToken(payload) {
  const TOKEN_SECRET = process.env.TOKEN_SECRET;
  return new Promise((res, rej) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) rej(err);
      res(token);
    });
  });
}
