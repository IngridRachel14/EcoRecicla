import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const smtpOptions: SMTPTransport.Options = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
};

export async function sendMail(to: string, subject: string, text: string) {
    try {
        const transporter = nodemailer.createTransport(smtpOptions);
        const info = await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: to,
            subject: subject,
            text: text
        })
        return info
    } catch (error) {
        throw error;
    }
}
