import { Resend } from "resend";

let client;

const getClient = () => {
  if (!client) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Falta la variable RESEND_API_KEY");
    }
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
};

const getFrom = () => {
  const name = process.env.MAIL_FROM_NAME || "Evas del Eden";
  const email = process.env.MAIL_FROM_EMAIL || "no-reply@evasdeleden.com";
  return `${name} <${email}>`;
};

export const sendMail = async ({ to, subject, html, text, replyTo }) => {
  // Resend no lanza excepción: devuelve { data, error }
  const { data, error } = await getClient().emails.send({
    from: getFrom(),
    to,
    subject,
    html,
    text,
    replyTo,
  });

  if (error) {
    const err = new Error(error.message);
    err.name = error.name;
    err.statusCode = error.statusCode;
    throw err;
  }
  return data;
};

// Resend no tiene "verify": solo comprobamos que esté la key
export const verifyMailConnection = async () => {
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ Falta RESEND_API_KEY: el envío de mails no va a funcionar.");
    return false;
  }
  console.log("✅ Servicio de mail configurado (Resend)");
  return true;
};