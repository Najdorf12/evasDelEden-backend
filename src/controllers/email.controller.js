import { Resend } from 'resend';

// Inicializa Resend con tu API key
const resend = new Resend('re_gcgSBD6n_NHfcokuaS34gDp7Rc4bm2yKp');  // Reemplaza con tu clave de API

// Controlador para manejar el envío de correos
export const sendEmail = async (req, res) => {
  const { email, wttp , message } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'TuEmpresa <info@tuempresa.com>',  // Correo remitente
      to: ['agustin.morro@gmail.com'], // Correo destinatario
      subject: `Consulta de ${email}`,
      html: `
        <h1>Detalles del contacto</h1>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${wttp}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
    });

    if (error) {
      return res.status(500).json({ error: 'Error al enviar el correo' });
    }

    res.status(200).json({ message: 'Correo enviado exitosamente', data });
  } catch (err) {
    console.error('Error en el controlador:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};