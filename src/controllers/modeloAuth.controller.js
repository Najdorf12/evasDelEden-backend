import crypto from "crypto";
import Modelo from "../models/modelo.model.js";
import bycrypt from "bcryptjs";
import { createModeloAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../services/mail.service.js";
import { resetPasswordEmail } from "../templates/resetPassword.template.js";
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

/* ---------------------------------------------------------------------
   RECUPERACIÓN DE CONTRASEÑA
   --------------------------------------------------------------------- */
const RESET_TOKEN_MINUTES = 60;

// En la base se guarda solo el hash del token; el token real viaja por mail
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const forgotPassword = async (req, res) => {
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim() : "";

  if (!email) return res.status(400).json(["El email es requerido"]);

  // Misma respuesta exista o no la cuenta, para no revelar qué emails están registrados
  const genericResponse = {
    message:
      "Si el email está registrado, te enviamos un link para restablecer tu contraseña.",
  };

  try {
    const modelo = await Modelo.findOne({ email });
    if (!modelo) return res.json(genericResponse);

    const rawToken = crypto.randomBytes(32).toString("hex");

    await Modelo.updateOne(
      { _id: modelo._id },
      {
        passwordResetToken: hashToken(rawToken),
        passwordResetExpires: new Date(
          Date.now() + RESET_TOKEN_MINUTES * 60 * 1000,
        ),
      },
    );

    const frontendUrl = (
      process.env.FRONTEND_URL || "http://localhost:5173"
    ).replace(/\/$/, "");
    const link = `${frontendUrl}/modelo/reset-password/${rawToken}`;

    const { subject, html, text } = resetPasswordEmail({
      username: modelo.username,
      link,
      minutes: RESET_TOKEN_MINUTES,
    });

    try {
      await sendMail({ to: modelo.email, subject, html, text });
    } catch (mailError) {
      // Se registra en el servidor pero no se le cuenta al usuario
      console.error("Error enviando mail de recuperación:", mailError.message);
    }

    return res.json(genericResponse);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(["No pudimos procesar la solicitud. Intentá nuevamente."]);
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const password = req.body?.password;

  if (typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json(["La contraseña debe tener al menos 8 caracteres"]);
  }

  try {
    const modelo = await Modelo.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!modelo) {
      return res
        .status(400)
        .json(["El link es inválido o expiró. Pedí uno nuevo."]);
    }

    modelo.password = await bycrypt.hash(password, 10);
    modelo.passwordResetToken = undefined;
    modelo.passwordResetExpires = undefined;
    await modelo.save();

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(["No pudimos actualizar la contraseña. Intentá nuevamente."]);
  }
};
