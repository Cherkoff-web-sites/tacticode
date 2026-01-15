import React, { useState } from "react";
import logoIcon from "./assets/icons/logo.svg";
import downloadIcon from "./assets/icons/download.svg";
import lkIcon from "./assets/icons/lk.svg";
import burgerIcon from "./assets/icons/burger.svg";

const VALID_LOGIN = "konst@mail.ru";
const VALID_PASSWORD = "passkonst";

const initialSubscriptions = [
  {
    id: "football",
    name: "Футбол ⚽",
    status: "inactive", // стартовое состояние: простая карточка с кнопкой «Купить»
    purchasedStatus: "active",
    since: "Активна с 13.10.2025",
    until: "13.10.2026",
    details: "Осталось 365 дней"
  },
  {
    id: "basketball",
    name: "Баскетбол 🏀",
    status: "inactive",
    purchasedStatus: "warning",
    since: "Активна с 26.09.2026",
    until: "13.10.2026",
    details: "Осталось 30 дней"
  },
  {
    id: "hockey",
    name: "Хоккей 🏒",
    status: "inactive",
    purchasedStatus: "expired",
    since: "",
    until: "",
    details: "Подписка истекла"
  },
  {
    id: "volleyball",
    name: "Волейбол 🏐",
    status: "inactive",
    purchasedStatus: "active",
    since: "Активна с 13.10.2025",
    until: "13.10.2026",
    details: "Осталось 365 дней"
  }
];

const initialDevices = [
  {
    name: "POCO POCO C65",
    location: "Moscow, Russia · 14:56"
  },
  {
    name: "EIII-PC",
    location: "Moscow, Russia · 14:56"
  },
  {
    name: "MSI Katana GF76 B12UCR-821XRU-13...",
    location: "Moscow, Russia · 14:56"
  }
];

const newsItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    title: "Обновление 2.14 уже доступно для скачивания!",
    description: "Встречайте новый доступный вид спорта для тренировок - хоккей! Вышедшее обновление позволит вашей команде выйти на новый уровень тренировок и п....",
    date: "10.10.2025"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop",
    title: "Нам исполняется 1 год!",
    description: "Благодарим за столь теплое внимание к Tacticode! Впереди больше обновлений и видос спорта.",
    date: "10.10.2025"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
    title: "Интерфейс без лишних кнопок — обновление UX",
    description: "Минималистичная панель инструментов, быстрый доступ к тактическим шаблонам, мгновенное сохранение изменений. И многое другое уже ждет ва...",
    date: "10.10.2025"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop",
    title: "Истории тренеров — почему они выбрали Tacticode",
    description: "Серия интервью с реальными тренерами, которые использовали бета-версию и улучшили подготовку команды, реальные примеры экономии времени и улучшен....",
    date: "10.10.2025"
  }
];

const subscriptionItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop",
    locked: false
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
    locked: true
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    locked: true
  }
];

export function App() {
  const [view, setView] = useState("home"); // home | lk
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [devices, setDevices] = useState(initialDevices);
  const [activeModal, setActiveModal] = useState(null);
  const [period, setPeriod] = useState("year");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [deviceToRemove, setDeviceToRemove] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [newsSlideIndex, setNewsSlideIndex] = useState(0);
  const [subscriptionSlideIndex, setSubscriptionSlideIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDownloadClick = () => {
    setLoginModalOpen(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView("home");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsAuthLoading(true);

    // имитация запроса к бэкенду
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (login === VALID_LOGIN && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      setView("lk");
      setLoginModalOpen(false);
      setPassword("");
    } else {
      setLoginError("Неверный логин или пароль");
    }

    setIsAuthLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-18 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)] sticky top-0 z-10">
        <div className={view !== "lk" ? "max-w-[1820px] mx-auto px-4 md:px-10" : "px-4 md:px-10"}>
          <div className="flex items-center justify-between h-18">
            {/* Desktop: Logo + Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <button
                className="flex items-center border-none bg-transparent p-0 cursor-pointer"
                onClick={() => {
                  setView("home");
                  setMobileMenuOpen(false);
                }}
              >
                <img src={logoIcon} alt="Tacticode" className="h-10" />
              </button>
              <nav className="flex gap-6 text-sm">
                <button
                  className="border-none bg-transparent p-0 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setView("home")}
                >
                  Новости
                </button>
                <button className="border-none bg-transparent p-0 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">Подписка</button>
                <button className="border-none bg-transparent p-0 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">Контакты</button>
              </nav>
            </div>

            {/* Mobile: Burger + Logo + Profile */}
            <div className="flex md:hidden items-center justify-between w-full">
              <button
                className="p-2 border-none bg-transparent cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Меню"
              >
                <img src={burgerIcon} alt="Меню" className="w-6 h-[18px]" />
              </button>
              <button
                className="flex items-center border-none bg-transparent p-0 cursor-pointer"
                onClick={() => {
                  setView("home");
                  setMobileMenuOpen(false);
                }}
              >
                <img src={logoIcon} alt="Tacticode" className="h-10" />
              </button>
              <button
                className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer p-0 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Профиль"
                onClick={() =>
                  isLoggedIn ? setView("lk") : setLoginModalOpen(true)
                }
              >
                <img src={lkIcon} alt="Личный кабинет" className="w-10 h-10" />
              </button>
            </div>

            {/* Desktop: Download + Profile */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                className="inline-flex items-center gap-2 px-[18px] py-2 rounded-full border-none bg-[#eef2ff] text-gray-900 text-sm cursor-pointer hover:bg-[#e0e7ff] transition-colors" 
                onClick={handleDownloadClick}
              >
                <span>Скачать</span>
                <img src={downloadIcon} alt="" className="w-5 h-5" />
              </button>
              <button
                className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer p-0 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Профиль"
                onClick={() =>
                  isLoggedIn ? setView("lk") : setLoginModalOpen(true)
                }
              >
                <img src={lkIcon} alt="Личный кабинет" className="w-10 h-10" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <nav className="flex flex-col py-4">
              <button
                className="px-4 py-3 text-left text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer"
                onClick={() => {
                  setView("home");
                  setMobileMenuOpen(false);
                }}
              >
                Новости
              </button>
              <button
                className="px-4 py-3 text-left text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Подписка
              </button>
              <button
                className="px-4 py-3 text-left text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Контакты
              </button>
              <button
                className="mx-4 mt-2 inline-flex items-center justify-center gap-2 px-[18px] py-2 rounded-full border-none bg-[#eef2ff] text-gray-900 text-sm cursor-pointer hover:bg-[#e0e7ff] transition-colors"
                onClick={() => {
                  handleDownloadClick();
                  setMobileMenuOpen(false);
                }}
              >
                <span>Скачать</span>
                <img src={downloadIcon} alt="" className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className={`flex-1 ${view === "home" ? "py-8 pb-10 flex flex-col items-stretch" : "py-8 px-10 pb-10"}`}>
        {view === "home" ? (
          <div className="max-w-[1820px] mx-auto px-10 w-full">
            <section className="mt-10">
              <div className="text-center mb-8">
                <h1 className="m-0 text-[32px] font-bold leading-[1.4]">
                  Мы <span className="text-[#1d4ed8]">сделали</span> сервис, который
                помогает тренерам{" "}
                  <span className="text-[#1d4ed8]">удобно</span> строить тактику,
                стратегию, готовиться к играм и тренировкам
              </h1>
            </div>
              <div className="relative">
                <div className="w-full h-[360px] rounded-[32px] bg-gradient-to-br from-[#80b0d9] to-[#c4dae9] shadow-[0_24px_60px_rgba(15,23,42,0.18)]" />
                <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 w-[min(720px,90%)]">
                  <div className="flex justify-between gap-3 px-6 py-4 bg-white rounded-[20px] shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
                    <div className="flex-1 text-center text-[13px]">
                      <div className="font-semibold">Российская</div>
                      <div className="text-gray-500">разработка</div>
                    </div>
                    <div className="flex-1 text-center text-[13px]">
                      <div className="font-semibold">Понятный</div>
                      <div className="text-gray-500">интерфейс</div>
                    </div>
                    <div className="flex-1 text-center text-[13px]">
                      <div className="font-semibold">Простая</div>
                      <div className="text-gray-500">оплата</div>
                    </div>
                    <div className="flex-1 text-center text-[13px]">
                      <div className="font-semibold">Быстрый вход</div>
                      <div className="text-gray-500">в приложение</div>
                    </div>
                  </div>
                </div>
                <div className="mt-18 mb-0 text-right font-bold">
                  Спорт разный — Tacticode один
                </div>
              </div>
            </section>

            <section className="mt-20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="m-0 text-2xl font-bold">Новости</h2>
                <button className="border-none bg-transparent p-0 text-sm text-primary cursor-pointer">Смотреть все</button>
              </div>
              <div className="relative overflow-hidden mb-4">
                <button
                  className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-primary bg-white text-primary text-lg cursor-pointer z-[2] flex items-center justify-center transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed left-0 md:-left-5"
                  onClick={() => setNewsSlideIndex(Math.max(0, newsSlideIndex - 1))}
                  disabled={newsSlideIndex === 0}
                >
                  ←
                </button>
                <div className="w-full overflow-hidden">
                  <div className="flex transition-transform duration-300 w-full" style={{ transform: `translateX(-${newsSlideIndex * 100}%)` }}>
                    {Array.from({ length: Math.ceil(newsItems.length / 4) }).map((_, slideIndex) => (
                      <div key={slideIndex} className="flex-[0_0_100%] flex gap-5 min-w-0">
                        {newsItems.slice(slideIndex * 4, slideIndex * 4 + 4).map((item) => (
                          <article key={item.id} className="flex-1 min-w-0 bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(15,23,42,0.04)] flex flex-col">
                            <div className="w-full h-[200px] overflow-hidden bg-gray-200">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex flex-col gap-2 flex-1">
                              <h3 className="m-0 text-base font-semibold leading-[1.4] text-gray-900">{item.title}</h3>
                              <p className="m-0 text-[13px] text-gray-500 leading-[1.5] flex-1">{item.description}</p>
                              <div className="text-xs text-gray-400 mt-auto">{item.date}</div>
                            </div>
                          </article>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-primary bg-white text-primary text-lg cursor-pointer z-[2] flex items-center justify-center transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed right-0 md:-right-5"
                  onClick={() => setNewsSlideIndex(Math.min(Math.ceil(newsItems.length / 4) - 1, newsSlideIndex + 1))}
                  disabled={newsSlideIndex >= Math.ceil(newsItems.length / 4) - 1}
                >
                  →
                </button>
              </div>
              <div className="flex justify-center gap-2">
                {Array.from({ length: Math.ceil(newsItems.length / 4) }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full border-none bg-gray-200 cursor-pointer p-0 transition-all ${
                      index === newsSlideIndex ? "bg-primary w-6 rounded" : ""
                    }`}
                    onClick={() => setNewsSlideIndex(index)}
                  />
                ))}
              </div>
            </section>

            <section className="mt-20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="m-0 text-2xl font-bold">Оформить подписку</h2>
                <button className="border-none bg-transparent p-0 text-sm text-primary cursor-pointer">Смотреть все</button>
              </div>
              <div className="relative overflow-hidden mb-4">
                <button
                  className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-primary bg-white text-primary text-lg cursor-pointer z-[2] flex items-center justify-center transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed left-0 md:-left-5"
                  onClick={() => setSubscriptionSlideIndex(Math.max(0, subscriptionSlideIndex - 1))}
                  disabled={subscriptionSlideIndex === 0}
                >
                  ←
                </button>
                <div className="w-full overflow-hidden">
                  <div className="flex transition-transform duration-300 w-full" style={{ transform: `translateX(-${subscriptionSlideIndex * 100}%)` }}>
                    {Array.from({ length: Math.ceil(subscriptionItems.length / 3) }).map((_, slideIndex) => (
                      <div key={slideIndex} className="flex-[0_0_100%] flex gap-5 min-w-0">
                        {subscriptionItems.slice(slideIndex * 3, slideIndex * 3 + 3).map((item) => (
                          <div key={item.id} className="flex-1 min-w-0">
                            <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
                              <img src={item.image} alt={`Подписка ${item.id}`} className="w-full h-full object-cover" />
                              {item.locked && (
                                <div className="absolute top-3 right-3 w-8 h-8 bg-black/70 rounded-lg flex items-center justify-center text-white">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-primary bg-white text-primary text-lg cursor-pointer z-[2] flex items-center justify-center transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed right-0 md:-right-5"
                  onClick={() => setSubscriptionSlideIndex(Math.min(Math.ceil(subscriptionItems.length / 3) - 1, subscriptionSlideIndex + 1))}
                  disabled={subscriptionSlideIndex >= Math.ceil(subscriptionItems.length / 3) - 1}
                >
                  →
                </button>
              </div>
              <div className="flex justify-center gap-2">
                {Array.from({ length: Math.ceil(subscriptionItems.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full border-none bg-gray-200 cursor-pointer p-0 transition-all ${
                      index === subscriptionSlideIndex ? "bg-primary w-6 rounded" : ""
                    }`}
                    onClick={() => setSubscriptionSlideIndex(index)}
                  />
                ))}
              </div>
            </section>

            <section className="max-w-[1120px] mx-auto mt-20">
              <div className="grid grid-cols-2 gap-20 items-start max-md:grid-cols-1 max-md:gap-10">
                <div className="max-md:order-2">
                  <h2 className="m-0 mb-8 text-2xl font-bold">Как начать работу</h2>
                  <ol className="list-none p-0 m-0 flex flex-col gap-6 [counter-reset:step-counter]">
                    {[
                      { text: "Зарегистрируйтесь в личном кабинете на сайте", btn: "Зарегистрироваться", onClick: () => setLoginModalOpen(true) },
                      { text: "Оформите подписку — без неё доступ к приложению будет закрыт", btn: "Оформить подписку" },
                      { text: "Скачайте приложение для вашего компьютера", btn: "Скачать приложение", onClick: handleDownloadClick },
                      { text: "Установите его и войдите в аккаунт, используя данные из личного кабинета" }
                    ].map((step, idx) => (
                      <li key={idx} className="flex flex-col gap-3 relative pl-10 [counter-increment:step-counter] before:content-[counter(step-counter)] before:absolute before:left-0 before:top-0 before:w-7 before:h-7 before:rounded-full before:bg-primary before:text-white before:flex before:items-center before:justify-center before:text-sm before:font-semibold before:flex-shrink-0">
                        <p className="m-0 text-sm leading-[1.5] text-gray-900">{step.text}</p>
                        {step.btn && (
                          <button
                            className="px-5 py-[10px] rounded-full border-none bg-[#eef2ff] text-gray-900 text-sm font-medium cursor-pointer self-start transition-colors hover:bg-[#e0e7ff]"
                            onClick={step.onClick}
                          >
                            {step.btn}
                          </button>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-col items-center gap-6 max-md:order-1">
                  <p className="m-0 text-sm text-gray-900 text-center flex items-center gap-2 justify-center">
                    Если у вас есть вопросы или нужна помощь — пишите нам
                    <span className="text-base">✍️</span>
                  </p>
                  <div className="flex justify-center">
                    <div className="w-[200px] h-[200px] rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center relative shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
                      <div className="w-16 h-16 rounded-full bg-[#0088cc] flex items-center justify-center text-white">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.37.74-.56 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.45.08-.02.25-.03.36.02.13.06.21.16.24.28.03.12.05.28.03.44z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <a href="https://t.me/tacticode" className="text-sm text-primary no-underline transition-colors hover:text-primary-dark hover:underline" target="_blank" rel="noopener noreferrer">
                      https://t.me/tacticode
                    </a>
                    <a href="https://t.me/tacticode" className="text-sm text-primary no-underline transition-colors hover:text-primary-dark hover:underline" target="_blank" rel="noopener noreferrer">
                      @tacticode
                    </a>
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="text-sm text-gray-500">Email</span>
                      <a href="mailto:support@tacticode.pro" className="text-sm text-primary no-underline transition-colors hover:text-primary-dark hover:underline">
                        support@tacticode.pro
                      </a>
                    </div>
                  </div>
              </div>
            </div>
          </section>
          </div>
        ) : (
          <>
            <section className="lk-header-row">
              <div className="lk-header-left">
                <h1 className="lk-title">Личный кабинет</h1>
                <button
                  className="link-button"
                  onClick={() => setHistoryModalOpen(true)}
                >
                  Посмотреть историю платежей
                </button>
              </div>
              <button className="link-button lk-logout" onClick={handleLogout}>
                Выйти из аккаунта
              </button>
            </section>

            <section className="lk-content">
          <div className="lk-column">
            <h2 className="section-title">Мои подписки</h2>

            <div className="cards-column">
              {subscriptions.map((sub) => {
                const isPurchased =
                  sub.status === "active" ||
                  sub.status === "warning" ||
                  sub.status === "expired";

                if (!isPurchased) {
                  // Стартовый простой вид карточки с кнопкой «Купить»
                  return (
                    <article
                      key={sub.id}
                      className="subscription-card subscription-card--inactive"
                    >
                      <div className="subscription-header">
                        <span className="subscription-name">{sub.name}</span>
                        <button
                          className="primary-outline-btn"
                          onClick={() =>
                            setActiveModal({ id: sub.id, mode: "buy" })
                          }
                        >
                          Купить
                        </button>
                      </div>
                      <div className="subscription-status-row">
                        <span className="subscription-status">
                          Подписка неактивна
                        </span>
                      </div>
                    </article>
                  );
                }

                // «Оживлённый» вид после покупки или продления
                return (
                  <article
                    key={sub.id}
                    className={`subscription-card subscription-card--${sub.status}`}
                  >
                    <div className="subscription-header">
                      <span className="subscription-name">{sub.name}</span>
                      <button
                        className="primary-outline-btn"
                        onClick={() =>
                          setActiveModal({ id: sub.id, mode: "renew" })
                        }
                      >
                        Продлить
                      </button>
                    </div>
                    {sub.status !== "expired" && (
                      <div className="subscription-meta">
                        <span className="subscription-since">{sub.since}</span>
                      </div>
                    )}
                    <div className="subscription-status-row">
                      <span className="subscription-status">
                        {sub.status === "expired"
                          ? "Подписка истекла"
                          : "Подписка активна до"}
                      </span>
                      {sub.status !== "expired" && (
                        <span className="subscription-until">
                          {sub.until}
                          <span className="subscription-details">
                            {` (${sub.details})`}
                          </span>
                        </span>
                      )}
                      {sub.status === "expired" && (
                        <span className="subscription-details">
                          {sub.details}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="lk-column">
            <h2 className="section-title">Основные данные</h2>

            <div className="field-group">
              <label className="field-label">Почта/Логин</label>
              <div className="input input-disabled input-with-icon">
                <span>Yandex@pochta.ru</span>
                <span className="icon-edit" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Пароль</label>
              <div className="input input-with-icon">
                <span>********</span>
                <div className="input-icons">
                  <span className="icon-eye" />
                </div>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Привязанные устройства</label>
              <div className="devices-card">
                {devices.length === 0 ? (
                  <div className="devices-empty">
                    <div className="devices-search-icon" />
                    <p className="devices-empty-text">
                      Кажется, вы еще не привязали
                      <br />
                      ни одно устройство
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="devices-list">
                      {devices.map((device, index) => (
                        <div
                          className="device-row"
                          key={device.name + index}
                        >
                          <div className="device-icon" />
                          <div className="device-info">
                            <div className="device-name">{device.name}</div>
                            <div className="device-meta">{device.location}</div>
                          </div>
                          <button
                            className="device-remove"
                            aria-label="Удалить"
                            onClick={() => setDeviceToRemove(device)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="devices-hint">
                      Удалить привязанное устройство можно 1 раз в месяц
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lk-column">
            <h2 className="section-title">Опциональная информация</h2>

            <div className="field-group">
              <label className="field-label">Фамилия</label>
              <div className="input input-with-icon">
                <span>Константинопольский</span>
                <span className="icon-edit" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Имя</label>
              <div className="input input-with-icon">
                <span>Константин</span>
                <span className="icon-edit" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Дата рождения</label>
              <div className="input input-with-icon">
                <span>02.06.2000</span>
                <span className="icon-edit" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Клуб</label>
              <div className="input input-with-icon">
                <span>«Спартак»</span>
                <span className="icon-edit" />
              </div>
            </div>

            <button className="primary-btn wide">Заполнить профиль</button>
          </div>
            </section>
          </>
        )}
      </main>

      <footer className="mt-auto py-4 bg-white text-[13px] text-gray-500">
        <div className={view !== "lk" ? "max-w-[1820px] mx-auto px-10" : "px-10"}>
          <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start max-md:gap-4">
            <div className="flex flex-col gap-2 max-md:order-1">
              <button
                className="flex items-center border-none bg-transparent p-0 cursor-pointer"
                onClick={() => setView("home")}
              >
                <img src={logoIcon} alt="Tacticode" className="h-10" />
              </button>
              <button className="border-none bg-transparent p-0 text-[13px] text-gray-400 cursor-pointer">
                Политика конфиденциальности
              </button>
            </div>
            <div className="flex flex-col items-center gap-2 max-md:items-start max-md:order-2">
              <nav className="flex gap-[18px]">
                <a href="#" className="text-gray-500">
                  Новости
                </a>
                <a href="#" className="text-gray-500">
                  Подписка
                </a>
                <a href="#" className="text-gray-500">
                  Контакты
                </a>
              </nav>
              <div className="text-xs">
                © 2025 ООО «Спорттехлаб». Все права защищены
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 max-md:items-start max-md:order-3">
              <button className="inline-flex items-center gap-2 px-[18px] py-2 rounded-full border-none bg-[#eef2ff] text-gray-900 text-sm cursor-pointer hover:bg-[#e0e7ff] transition-colors">
                <span>Скачать</span>
                <img src={downloadIcon} alt="" className="w-5 h-5" />
              </button>
              <button className="w-9 h-9 rounded-full border-none bg-gray-200 cursor-pointer" aria-label="Профиль" />
              <button className="border-none bg-transparent p-0 text-[13px] text-gray-400 cursor-pointer">
                Пользовательское соглашение
              </button>
            </div>
          </div>
        </div>
      </footer>

      {activeModal && view === "lk" && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <div className="modal-title">
                {
                  subscriptions.find((s) => s.id === activeModal.id)?.name?.split(
                    " "
                  )[0]
                }
              </div>
              <button
                className="modal-close"
                onClick={() => setActiveModal(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-section-title">
              Выберите длительность подписки
            </div>
            <div className="modal-toggle">
              <button
                className={
                  "modal-toggle-btn" +
                  (period === "year" ? " modal-toggle-btn--active" : "")
                }
                onClick={() => setPeriod("year")}
              >
                На год
              </button>
              <button
                className={
                  "modal-toggle-btn" +
                  (period === "month" ? " modal-toggle-btn--active" : "")
                }
                onClick={() => setPeriod("month")}
              >
                На месяц
              </button>
            </div>

            <div className="modal-prices">
              <div className="modal-price-main">
                3990&nbsp;р/год
                <div className="modal-price-old">5980&nbsp;р/год</div>
              </div>
              <div className="modal-price-sub">
                322&nbsp;р/месяц
                <span className="modal-price-strike">490&nbsp;р/месяц</span>
                <span className="modal-price-benefit">Выгода 32%</span>
              </div>
            </div>

            <div className="modal-section-title">
              Выберите способ оплаты
            </div>
            <div className="modal-actions">
              <button
                className="primary-btn modal-pay-btn"
                onClick={() => {
                  setSubscriptions((prev) =>
                    prev.map((s) =>
                      s.id === activeModal.id
                        ? { ...s, status: s.purchasedStatus }
                        : s
                    )
                  );
                  setActiveModal(null);
                }}
              >
                Банковской картой
              </button>
              <button
                className="primary-outline-btn modal-pay-btn"
                onClick={() => {
                  setSubscriptions((prev) =>
                    prev.map((s) =>
                      s.id === activeModal.id
                        ? { ...s, status: s.purchasedStatus }
                        : s
                    )
                  );
                  setActiveModal(null);
                }}
              >
                По QR-коду (СБП)
              </button>
            </div>
          </div>
        </div>
      )}

      {loginModalOpen && (
        <div className="modal-backdrop" onClick={() => setLoginModalOpen(false)}>
          <div
            className="modal auth-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <div className="modal-title">Войти</div>
              <button
                className="modal-close"
                onClick={() => setLoginModalOpen(false)}
              >
                ×
              </button>
            </div>
            <button className="auth-register-link">Зарегистрироваться</button>

            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="field-group">
                <label className="field-label">Логин/Почта</label>
                <input
                  className="input input-field"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Логин/Почта"
                />
              </div>
              <div className="field-group">
                <label className="field-label">Пароль</label>
                <input
                  className="input input-field"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                />
              </div>

              <div className="auth-row">
                <label className="auth-remember">
                  <input type="checkbox" />{" "}
                  <span>Запомнить меня</span>
                </label>
                <button
                  type="button"
                  className="link-button subtle auth-forgot"
                >
                  Я забыл пароль
                </button>
              </div>

              {loginError && (
                <div className="auth-error">{loginError}</div>
              )}

              <button
                type="submit"
                className="primary-btn auth-submit"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? "Вход..." : "Войти"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deviceToRemove && view === "lk" && (
        <div className="modal-backdrop" onClick={() => setDeviceToRemove(null)}>
          <div
            className="modal auth-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <div className="modal-title">
                Вы уверены, что хотите удалить устройство?
              </div>
              <button
                className="modal-close"
                onClick={() => setDeviceToRemove(null)}
              >
                ×
              </button>
            </div>

            <p className="devices-hint modal-devices-hint">
              Удалить привязанное устройство можно 1 раз в месяц
            </p>

            <div className="modal-actions modal-actions-column">
              <button
                className="primary-btn modal-pay-btn"
                onClick={() => {
                  setDevices((prev) =>
                    prev.filter((d) => d.name !== deviceToRemove.name)
                  );
                  setDeviceToRemove(null);
                }}
              >
                Удалить устройство
              </button>
              <button
                className="primary-outline-btn modal-pay-btn"
                onClick={() => setDeviceToRemove(null)}
              >
                Вернуться назад
              </button>
            </div>
          </div>
        </div>
      )}

      {historyModalOpen && view === "lk" && (
        <div className="modal-backdrop" onClick={() => setHistoryModalOpen(false)}>
          <div
            className="modal history-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title">История платежей</div>
              <button
                className="modal-close"
                onClick={() => setHistoryModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="history-header-row">
              <span className="history-muted">Вы с нами</span>
              <span className="history-period">4 года 2 месяца</span>
            </div>

            <div className="history-list">
              {[
                {
                  id: 1,
                  amount: "3990 р",
                  date: "13.10.2025",
                  sport: "Хоккей 🏒",
                  line1: "Куплено на 1 год",
                  line2: "Visa Сберкарта •• 9698",
                  methodLabel: "Способ оплаты"
                },
                {
                  id: 2,
                  amount: "490 р",
                  date: "13.10.2025",
                  sport: "Хоккей 🏒",
                  line1: "Куплено на 1 месяц",
                  line2: "QR-код",
                  methodLabel: "Способ оплаты"
                },
                {
                  id: 3,
                  amount: "490 р",
                  date: "13.10.2025",
                  sport: "Футбол ⚽",
                  line1: "Куплено на 1 месяц",
                  line2: "Visa Сберкарта •• 9698",
                  methodLabel: "Способ оплаты"
                },
                {
                  id: 4,
                  amount: "3990 р",
                  date: "13.10.2025",
                  sport: "Хоккей 🏒",
                  line1: "Куплено на 1 год",
                  line2: "Visa Сберкарта •• 9698",
                  methodLabel: "Способ оплаты"
                }
              ].map((item) => (
                <div className="history-item" key={item.id}>
                  <div className="history-item-main">
                    <div className="history-item-amount">{item.amount}</div>
                    <div className="history-item-date">{item.date}</div>
                  </div>
                  <div className="history-item-sub">
                    <div className="history-item-left">
                      <div>{item.line1}</div>
                      <div className="history-muted">{item.line2}</div>
                    </div>
                    <div className="history-item-right">
                      <div className="history-muted">{item.sport}</div>
                      <div className="history-muted small">
                        {item.methodLabel}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


