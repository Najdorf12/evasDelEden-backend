import nodemailer from "nodemailer";

const EMAIL_USER = "agustin.morro@gmail.com";
const EMAIL_PASS = "cmvv kval drio fuzb";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: EMAIL_USER, 
      pass: EMAIL_PASS 
  }
});

export const sendEmail = async(req, res) =>  {
  const { email, wttp, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Evas del Eden"<${EMAIL_USER}>`,
      to: "agustin.morro@gmail.com",
      subject: `Consulta de ${email} / EVAS DEL EDEN /`,
      html: `
                <h1>Detalles del contacto:</h1>
                <p><strong>Email:</strong>${email}</p>
                <p><strong>WhatsApp:</strong>${wttp}</p>
                <p><strong>Mensaje:</strong>${message}</p>
            `,
    });

    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (err) {
    console.error("Error en el controlador:", err);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
}



