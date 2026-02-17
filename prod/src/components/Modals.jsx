import React from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const HISTORY_ITEMS = [
  { id: 1, amount: "3990 р", date: "13.10.2025", sport: "Хоккей 🏒", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 2, amount: "490 р", date: "13.10.2025", sport: "Хоккей 🏒", line1: "Куплено на 1 месяц", line2: "QR-код", methodLabel: "Способ оплаты" },
  { id: 3, amount: "490 р", date: "13.10.2025", sport: "Футбол ⚽", line1: "Куплено на 1 месяц", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 4, amount: "3990 р", date: "13.10.2025", sport: "Хоккей 🏒", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" }
];

export function Modals() {
  const location = useLocation();
  const isLk = location.pathname === "/lk";
  const {
    loginModalOpen,
    setLoginModalOpen,
    login,
    setLogin,
    password,
    setPassword,
    loginError,
    isAuthLoading,
    handleLoginSubmit,
    subscriptions,
    activeModal,
    setActiveModal,
    period,
    setPeriod,
    setSubscriptions,
    deviceToRemove,
    setDeviceToRemove,
    setDevices,
    historyModalOpen,
    setHistoryModalOpen
  } = useApp();

  return (
    <>
      {activeModal && isLk && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {subscriptions.find((s) => s.id === activeModal.id)?.name?.split(" ")[0]}
              </div>
              <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-section-title">Выберите длительность подписки</div>
            <div className="modal-toggle">
              <button type="button" className={"modal-toggle-btn" + (period === "year" ? " modal-toggle-btn--active" : "")} onClick={() => setPeriod("year")}>На год</button>
              <button type="button" className={"modal-toggle-btn" + (period === "month" ? " modal-toggle-btn--active" : "")} onClick={() => setPeriod("month")}>На месяц</button>
            </div>
            <div className="modal-prices">
              <div className="modal-price-main">3990&nbsp;р/год<div className="modal-price-old">5980&nbsp;р/год</div></div>
              <div className="modal-price-sub">322&nbsp;р/месяц<span className="modal-price-strike">490&nbsp;р/месяц</span><span className="modal-price-benefit">Выгода 32%</span></div>
            </div>
            <div className="modal-section-title">Выберите способ оплаты</div>
            <div className="modal-actions">
              <button type="button" className="primary-btn modal-pay-btn" onClick={() => { setSubscriptions((prev) => prev.map((s) => (s.id === activeModal.id ? { ...s, status: s.purchasedStatus } : s))); setActiveModal(null); }}>Банковской картой</button>
              <button type="button" className="primary-outline-btn modal-pay-btn" onClick={() => { setSubscriptions((prev) => prev.map((s) => (s.id === activeModal.id ? { ...s, status: s.purchasedStatus } : s))); setActiveModal(null); }}>По QR-коду (СБП)</button>
            </div>
          </div>
        </div>
      )}

      {loginModalOpen && (
        <div className="modal-backdrop" onClick={() => setLoginModalOpen(false)}>
          <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Войти</div>
              <button type="button" className="modal-close" onClick={() => setLoginModalOpen(false)}>×</button>
            </div>
            <button type="button" className="auth-register-link">Зарегистрироваться</button>
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="field-group">
                <label className="field-label">Логин/Почта</label>
                <input className="input input-field" type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин/Почта" />
              </div>
              <div className="field-group">
                <label className="field-label">Пароль</label>
                <input className="input input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
              </div>
              <div className="auth-row">
                <label className="auth-remember"><input type="checkbox" /> <span>Запомнить меня</span></label>
                <button type="button" className="link-button subtle auth-forgot">Я забыл пароль</button>
              </div>
              {loginError && <div className="auth-error">{loginError}</div>}
              <button type="submit" className="primary-btn auth-submit" disabled={isAuthLoading}>{isAuthLoading ? "Вход..." : "Войти"}</button>
            </form>
          </div>
        </div>
      )}

      {deviceToRemove && isLk && (
        <div className="modal-backdrop" onClick={() => setDeviceToRemove(null)}>
          <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Вы уверены, что хотите удалить устройство?</div>
              <button type="button" className="modal-close" onClick={() => setDeviceToRemove(null)}>×</button>
            </div>
            <p className="devices-hint modal-devices-hint">Удалить привязанное устройство можно 1 раз в месяц</p>
            <div className="modal-actions modal-actions-column">
              <button type="button" className="primary-btn modal-pay-btn" onClick={() => { setDevices((prev) => prev.filter((d) => d.name !== deviceToRemove.name)); setDeviceToRemove(null); }}>Удалить устройство</button>
              <button type="button" className="primary-outline-btn modal-pay-btn" onClick={() => setDeviceToRemove(null)}>Вернуться назад</button>
            </div>
          </div>
        </div>
      )}

      {historyModalOpen && isLk && (
        <div className="modal-backdrop" onClick={() => setHistoryModalOpen(false)}>
          <div className="modal history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">История платежей</div>
              <button type="button" className="modal-close" onClick={() => setHistoryModalOpen(false)}>×</button>
            </div>
            <div className="history-header-row">
              <span className="history-muted">Вы с нами</span>
              <span className="history-period">4 года 2 месяца</span>
            </div>
            <div className="history-list">
              {HISTORY_ITEMS.map((item) => (
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
                      <div className="history-muted small">{item.methodLabel}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
