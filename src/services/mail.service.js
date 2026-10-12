import nodemailer from "nodemailer";

const EMAIL_USER = "agustin.morro@gmail.com"
const EMAIL_PASS = "qzaw lgru coge pyxn"
const EMAIL_FROM_NAME = "Evas del Eden";

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn(
    "⚠️  Faltan EMAIL_USER / EMAIL_PASS: el envío de mails no va a funcionar.",
  );
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  // Timeouts cortos: si el hosting bloquea SMTP, falla rápido en vez de colgarse
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

export const sendMail = ({ to, subject, html, text, replyTo }) =>
  transporter.sendMail({
    from: `"${EMAIL_FROM_NAME}" <${EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
    replyTo,
  });

// Sirve para comprobar la conexión con Gmail (ej. al iniciar el servidor)
export const verifyMailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Servicio de mail listo");
    return true;
  } catch (error) {
    console.error("❌ No se pudo conectar con el servicio de mail:", error.message);
    return false;
  }
};
