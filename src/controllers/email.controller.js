import { sendMail } from "../services/mail.service.js";

// Adónde llegan las consultas del formulario de contacto
const CONTACT_TO = process.env.CONTACT_TO || "agustin.morro@gmail.com";

const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );

export const sendEmail = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { email, wttp, message } = req.body || {};

  try {
    await sendMail({
      to: CONTACT_TO,
      replyTo: email,
      subject: `Consulta de ${email} / EVAS DEL EDEN /`,
      html: `
        <h1>Detalles del contacto:</h1>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>WhatsApp:</strong> ${escapeHtml(wttp)}</p>
        <p><strong>Mensaje:</strong> ${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (err) {
    console.error("Error en el controlador:", err);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
};
