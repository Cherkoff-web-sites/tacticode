import React from "react";
import { useApp } from "./context/AppContext";

export function LkPage() {
  const {
    subscriptions,
    devices,
    setHistoryModalOpen,
    handleLogout,
    setActiveModal,
    setDeviceToRemove,
  } = useApp();

  return (
    <>
      <section className="lk-header-row">
        <div className="lk-header-left">
          <h1 className="lk-title">Личный кабинет</h1>
          <button type="button" className="link-button" onClick={() => setHistoryModalOpen(true)}>
            Посмотреть историю платежей
          </button>
        </div>
        <button type="button" className="link-button lk-logout" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </section>

      <section className="lk-content">
        <div className="lk-column">
          <h2 className="">Мои подписки</h2>

          <div className="cards-column">
            {subscriptions.map((sub) => {
              const isPurchased =
                sub.status === "active" ||
                sub.status === "warning" ||
                sub.status === "expired";

              if (!isPurchased) {
                return (
                  <article
                    key={sub.id}
                    className="subscription-card subscription-card--inactive"
                  >
                    <div className="subscription-header">
                      <span className="subscription-name">{sub.name}</span>
                      <button
                        className="primary-outline-btn"
                        onClick={() => setActiveModal({ id: sub.id, title: sub.name, mode: "buy" })}
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

              return (
                <article
                  key={sub.id}
                  className={`subscription-card subscription-card--${sub.status}`}
                >
                  <div className="subscription-header">
                    <span className="subscription-name">{sub.name}</span>
                    <button
                      className="primary-outline-btn"
                      onClick={() => setActiveModal({ id: sub.id, title: sub.name, mode: "renew" })}
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
          <h2 className="">Основные данные</h2>

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
          <h2 className="">Опциональная информация</h2>

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
  );
}

