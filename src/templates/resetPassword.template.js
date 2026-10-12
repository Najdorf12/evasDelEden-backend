/* Ubicación sugerida: backend/templates/resetPassword.template.js */

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

export const resetPasswordEmail = ({ username, link, minutes = 60 }) => {
  const name = escapeHtml(username || "");

  return {
    subject: "Recuperá tu contraseña | Evas del Eden",

    text: `Hola ${username || ""},

Recibimos un pedido para restablecer la contraseña de tu cuenta. Ingresá a este link para elegir una nueva (vale ${minutes} minutos y se puede usar una sola vez):

${link}

Si no fuiste vos, ignorá este mensaje: tu contraseña sigue siendo la misma.

EVAS DEL EDEN`,

    html: `
<div style="background:#18181b;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#1e1033;border:1px solid #7e22ce;border-radius:12px;padding:32px 24px;color:#e4e4e7;">
    <h1 style="margin:0 0 16px;font-size:24px;color:#ffffff;">Recuperá tu contraseña</h1>
    <p style="margin:0 0 12px;font-size:15px;">Hola ${name},</p>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">
      Recibimos un pedido para restablecer la contraseña de tu cuenta. Tocá el botón para elegir una nueva:
    </p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${link}" style="display:inline-block;background:#7e22ce;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;font-size:15px;">
        Restablecer contraseña
      </a>
    </p>
    <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#a1a1aa;">
      El link vale ${minutes} minutos y se puede usar una sola vez. Si el botón no funciona, copiá y pegá esta dirección en tu navegador:
    </p>
    <p style="margin:0 0 16px;font-size:12px;word-break:break-all;color:#c084fc;">${link}</p>
    <p style="margin:0;font-size:13px;line-height:1.5;color:#a1a1aa;">
      Si no pediste este cambio, ignorá este mensaje: tu contraseña sigue siendo la misma.
    </p>
    <p style="margin:24px 0 0;font-size:12px;color:#71717a;">EVAS DEL EDEN</p>
  </div>
</div>`,
  };
};
