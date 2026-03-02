import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 0);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP settings missing: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });

  return transporter;
}

export async function sendCodeEmail(to, subject, code) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const text = `Ваш код: ${code}`;

  const mailer = getTransporter();
  await mailer.sendMail({
    from,
    to,
    subject,
    text
  });
}
