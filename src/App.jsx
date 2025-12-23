import React, { useState } from "react";

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
    <div className="page">
      <header className="header">
        <div className="header-left">
          <button
            className="logo logo-button"
            onClick={() => setView("home")}
          >
            <span className="logo-text">Tacticode</span>
          </button>
          <nav className="nav">
            <button
              className={
                "nav-link nav-link-button" +
                (view === "home" ? " active" : "")
              }
              onClick={() => setView("home")}
            >
              Новости
            </button>
            <button className="nav-link nav-link-button">Подписка</button>
            <button className="nav-link nav-link-button">Контакты</button>
          </nav>
        </div>
        <div className="header-right">
          <button className="download-btn" onClick={handleDownloadClick}>
            <span>Скачать</span>
            <span className="download-icon" />
          </button>
          <button
            className="avatar-btn"
            aria-label="Профиль"
            onClick={() =>
              isLoggedIn ? setView("lk") : setLoginModalOpen(true)
            }
          />
        </div>
      </header>

      <main className={view === "home" ? "main home-main" : "main"}>
        {view === "home" ? (
          <section className="hero">
            <div className="hero-text">
              <h1 className="hero-title">
                Мы <span className="hero-accent">сделали</span> сервис, который
                помогает тренерам{" "}
                <span className="hero-accent">удобно</span> строить тактику,
                стратегию, готовиться к играм и тренировкам
              </h1>
            </div>
            <div className="hero-media">
              <div className="hero-video-placeholder" />
              <div className="hero-features">
                <div className="hero-features-row">
                  <div className="hero-feature">
                    <div className="hero-feature-title">Российская</div>
                    <div className="hero-feature-subtitle">разработка</div>
                  </div>
                  <div className="hero-feature">
                    <div className="hero-feature-title">Понятный</div>
                    <div className="hero-feature-subtitle">интерфейс</div>
                  </div>
                  <div className="hero-feature">
                    <div className="hero-feature-title">Простая</div>
                    <div className="hero-feature-subtitle">оплата</div>
                  </div>
                  <div className="hero-feature">
                    <div className="hero-feature-title">Быстрый вход</div>
                    <div className="hero-feature-subtitle">в приложение</div>
                  </div>
                </div>
              </div>
              <div className="hero-tagline">
                Спорт разный — Tacticode один
              </div>
            </div>
          </section>
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

      <footer className="footer">
        <div className="footer-left">
          <button
            className="logo logo-button"
            onClick={() => setView("home")}
          >
            <span className="logo-text">Tacticode</span>
          </button>
          <button className="link-button subtle">
            Политика конфиденциальности
          </button>
        </div>
        <div className="footer-center">
          <nav className="nav nav-footer">
            <a href="#" className="nav-link">
              Новости
            </a>
            <a href="#" className="nav-link">
              Подписка
            </a>
            <a href="#" className="nav-link">
              Контакты
            </a>
          </nav>
          <div className="copyright">
            © 2025 ООО «Спорттехлаб». Все права защищены
          </div>
        </div>
        <div className="footer-right">
          <button className="download-btn">
            <span>Скачать</span>
            <span className="download-icon" />
          </button>
          <button className="avatar-btn muted" aria-label="Профиль" />
          <button className="link-button subtle">
            Пользовательское соглашение
          </button>
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


