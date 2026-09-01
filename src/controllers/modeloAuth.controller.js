import Modelo from "../models/modelo.model.js";
import bycrypt from "bcryptjs";
import { createModeloAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const modeloFound = await Modelo.findOne({ email });
    if (modeloFound) return res.status(400).json(["The email already exist"]);

    const passwordHash = await bycrypt.hash(password, 10);

    const newModelo = new Modelo({
      username,
      email,
      password: passwordHash,
    });

    const modeloSaved = await newModelo.save();

    const token = await createModeloAccessToken({ id: modeloSaved._id });

    res.cookie("modeloToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({
      id: modeloSaved._id,
      username: modeloSaved.username,
      email: modeloSaved.email,
      eva: modeloSaved.eva,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const modeloFound = await Modelo.findOne({ email });
    if (!modeloFound) return res.status(400).json(["Invalid credentials"]);

    const isMatch = await bycrypt.compare(password, modeloFound.password);
    if (!isMatch) return res.status(400).json(["Invalid credentials."]);

    const token = await createModeloAccessToken({ id: modeloFound._id });
    res.cookie("modeloToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({
      id: modeloFound._id,
      username: modeloFound.username,
      email: modeloFound.email,
      eva: modeloFound.eva,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("modeloToken", "", {
    sameSite: "none",
    secure: true,
    httpOnly: false,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
  const { modeloToken } = req.cookies;
  const TOKEN_SECRET = `${process.env.TOKEN_SECRET}`;
  try {
    jwt.verify(modeloToken, TOKEN_SECRET, async (error, modelo) => {
      if (error) return res.status(401).json({ message: "Unauthorized" });
      const modeloFound = await Modelo.findById(modelo.id);
      if (!modeloFound)
        return res.status(401).json({ message: "Unauthorized" });

      return res.json({
        id: modeloFound.id,
        username: modeloFound.username,
        email: modeloFound.email,
        eva: modeloFound.eva,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  const modeloFound = await Modelo.findById(req.modelo.id).populate("eva");
  if (!modeloFound)
    return res.status(400).json({ message: "Modelo not found" });

  return res.json({
    id: modeloFound._id,
    username: modeloFound.username,
    email: modeloFound.email,
    eva: modeloFound.eva,
  });
};
