/**
 * Мок-данные для страницы ЛК.
 * Удалить этот файл и обновить AppContext при подключении API подписок/устройств.
 */
export const MOCK_SUBSCRIPTIONS = [
  { id: "football", name: "Футбол ⚽", status: "inactive", purchasedStatus: "active", since: "Активна с 13.10.2025", until: "13.10.2026", details: "Осталось 365 дней" },
  { id: "basketball", name: "Баскетбол 🏀", status: "inactive", purchasedStatus: "warning", since: "Активна с 26.09.2026", until: "13.10.2026", details: "Осталось 30 дней" },
  { id: "hockey", name: "Хоккей 🏒", status: "inactive", purchasedStatus: "expired", since: "", until: "", details: "Подписка истекла" },
  { id: "volleyball", name: "Волейбол 🏐", status: "inactive", purchasedStatus: "active", since: "Активна с 13.10.2025", until: "13.10.2026", details: "Осталось 365 дней" }
];

export const MOCK_DEVICES = [
  { name: "POCO POCO C65", location: "Moscow, Russia · 14:56" },
  { name: "EIII-PC", location: "Moscow, Russia · 14:56" },
  { name: "MSI Katana GF76 B12UCR-821XRU-13.", location: "Moscow, Russia · 14:56" }
];
