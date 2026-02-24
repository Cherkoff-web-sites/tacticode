export async function sendCodeEmail(to, subject, code) {
  const text = `Ваш код: ${code}`;
  // Временная заглушка: реальная почта отключена, просто логируем
  console.log(`[mailer] (stub) ${subject} для ${to}: ${text}`);
}
