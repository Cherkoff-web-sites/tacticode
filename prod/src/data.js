import newsImage1 from "./assets/images/news_1.png";
import newsImage2 from "./assets/images/news_2.png";
import newsImage3 from "./assets/images/news_3.png";
import newsImage4 from "./assets/images/news_4.png";
import footballImage from "./assets/images/football.png";
import basketballImage from "./assets/images/basketball.png";
import hockeyImage from "./assets/images/hockey.png";
import tennisImage from "./assets/images/tennis.png";
import voleyballImage from "./assets/images/voleyball.png";
import waterballImage from "./assets/images/waterball.png";

export const newsItems = [
  { id: 1, image: newsImage1, title: "Обновление 2.14 уже доступно для скачивания!", description: "Встречайте новый доступный вид спорта для тренировок - хоккей! Вышедшее обновление позволит вашей команде выйти на новый уровень тренировок и п....", date: "10.10.2025" },
  { id: 2, image: newsImage2, title: "Нам исполняется 1 год!", description: "Благодарим за столь теплое внимание к Tacticode! Впереди больше обновлений и видос спорта.", date: "10.10.2025" },
  { id: 3, image: newsImage3, title: "Интерфейс без лишних кнопок — обновление UX", description: "Минималистичная панель инструментов, быстрый доступ к тактическим шаблонам, мгновенное сохранение изменений. И многое другое уже ждет ва...", date: "10.10.2025" },
  { id: 4, image: newsImage4, title: "Истории тренеров — почему они выбрали Tacticode", description: "Серия интервью с реальными тренерами, которые использовали бета-версию и улучшили подготовку команды, реальные примеры экономии времени и улучшен....", date: "10.10.2025" }
];

export const subscriptionItems = [
  { id: 1, image: footballImage, locked: false },
  { id: 2, image: basketballImage, locked: true },
  { id: 3, image: hockeyImage, locked: true },
  { id: 4, image: tennisImage, locked: true },
  { id: 5, image: voleyballImage, locked: true },
  { id: 6, image: waterballImage, locked: true }
];

export const initialSubscriptions = [
  { id: "football", name: "Футбол ⚽", status: "inactive", purchasedStatus: "active", since: "Активна с 13.10.2025", until: "13.10.2026", details: "Осталось 365 дней" },
  { id: "basketball", name: "Баскетбол 🏀", status: "inactive", purchasedStatus: "warning", since: "Активна с 26.09.2026", until: "13.10.2026", details: "Осталось 30 дней" },
  { id: "hockey", name: "Хоккей 🏒", status: "inactive", purchasedStatus: "expired", since: "", until: "", details: "Подписка истекла" },
  { id: "volleyball", name: "Волейбол 🏐", status: "inactive", purchasedStatus: "active", since: "Активна с 13.10.2025", until: "13.10.2026", details: "Осталось 365 дней" }
];

export const initialDevices = [
  { name: "POCO POCO C65", location: "Moscow, Russia · 14:56" },
  { name: "EIII-PC", location: "Moscow, Russia · 14:56" },
  { name: "MSI Katana GF76 B12UCR-821XRU-13...", location: "Moscow, Russia · 14:56" }
];

export const VALID_LOGIN = "konst@mail.ru";
export const VALID_PASSWORD = "passkonst";
