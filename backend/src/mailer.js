const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

function getFrom() {
  const email = process.env.MAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
  const name = process.env.MAIL_FROM_NAME || "Tacticode";
  return { email: email || "noreply@tacticode.ru", name };
}

export async function sendCodeEmail(to, subject, code) {
  const text = `Ваш код: ${code}`;
  const apiKey = process.env.BREVO_API_KEY;

  if (apiKey) {
    try {
      const from = getFrom();
      const res = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: { name: from.name, email: from.email },
          to: [{ email: to }],
          subject,
          textContent: text,
        }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        console.error("[mailer] Brevo API error:", res.status, errBody);
        return;
      }
      return;
    } catch (err) {
      console.error("[mailer] Brevo request failed (код сохранён в БД):", err);
      return;
    }
  }

  console.log(`[mailer] Ни Brevo, ни SMTP не настроены. Код для ${to}: ${code}`);
}
