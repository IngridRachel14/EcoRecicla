import fs from "node:fs";
import path from "node:path";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface MailAttachment {
  content: string;
  name: string;
  contentId?: string;
}

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  attachments?: MailAttachment[]
) {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        name: "EcoRecicla",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: text,
      ...(attachments?.length ? { attachment: attachments } : {}),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Error al enviar correo con Brevo: ${response.status} - ${errorBody}`
    );
  }

  return await response.json();
}

export function getEcoReciclaLogoAttachment(): MailAttachment {
  const logoPath = path.resolve(
    process.cwd(),
    "assets",
    "images",
    "Eco-recicla-panamá.png"
  );

  const logo = fs.readFileSync(logoPath);

  return {
    content: logo.toString("base64"),
    name: "Eco-recicla-panama.png",
    contentId: "ecorecicla-logo",
  };
}