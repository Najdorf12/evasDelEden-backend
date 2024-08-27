import User from "../models/user.model.js";
import bycrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["The email already exist"]);

    const passwordHash = await bycrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token,{
      sameSite: "none",
      secure: true,
      httpOnly: false,
    });
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
/*   const TOKEN_SECRET = `${process.env.TOKEN_SECRET}`; */
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json(["Invalid credentials"]);

    const isMatch = await bycrypt.compare(password, userFound.password);

    if (!isMatch) return res.status(400).json(["Invalid credentials."]);

    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: false,
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    sameSite: "none",
    secure: true,
    httpOnly: false,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
/*   console.log(token) */
  const TOKEN_SECRET = `${process.env.TOKEN_SECRET}`;
  try {
    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
      if (error) return res.status(401).json({ message: "Unauthorized" });
      const userFound = await User.findById(user.id);
      if (!userFound) return res.status(401).json({ message: "Unauthorized" });

      return res.json({
        id: userFound.id,
        username: userFound.username,
        email: userFound.email,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
  });
};