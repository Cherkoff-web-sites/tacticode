import nodemailer from "nodemailer";

const SMTP_TIMEOUT_MS = 15000;

let smtpTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
  });
}

export async function sendCodeEmail(to, subject, code) {
  const text = `Ваш код: ${code}`;

  if (smtpTransporter) {
    try {
      const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@tacticode.ru";
      await smtpTransporter.sendMail({
        from,
        to,
        subject,
        text,
      });
      return;
    } catch (err) {
      console.error("[mailer] SMTP ошибка (код сохранён в БД):", err.message || err);
      return;
    }
  }

  console.log(`[mailer] SMTP не настроен. Код для ${to}: ${code}`);
}
