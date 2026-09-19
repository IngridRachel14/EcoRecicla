
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendMail(to: string, subject: string, text: string) {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        name: "EcoRecicla",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error al enviar correo con Brevo: ${response.status} - ${errorBody}`);
  }

  return await response.json();
}
