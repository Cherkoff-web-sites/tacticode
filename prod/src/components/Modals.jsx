import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import BaseModal from "./BaseModal";

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
    setHistoryModalOpen,
    logoutModalOpen,
    setLogoutModalOpen,
    newsModalItem,
    setNewsModalItem,
    handleLogout
  } = useApp();

  const isAnyModalOpen = Boolean(
    loginModalOpen ||
    activeModal ||
    deviceToRemove ||
    logoutModalOpen ||
    historyModalOpen ||
    newsModalItem
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isAnyModalOpen]);

  return (
    <>
      <BaseModal
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        title={subscriptions.find((s) => s.id === activeModal?.id)?.name?.split(" ")[0]}
      >
        <div className="text-sm text-gray-500 mb-2">Выберите длительность подписки</div>
        <div className="inline-flex p-1 bg-gray-100 rounded-full gap-1 mb-5">
          <button
            type="button"
            className={`border-none bg-transparent px-[22px] py-2 rounded-full text-sm cursor-pointer ${period === "year" ? "bg-[#e5edff] text-gray-900" : "text-gray-500"}`}
            onClick={() => setPeriod("year")}
          >
            На год
          </button>
          <button
            type="button"
            className={`border-none bg-transparent px-[22px] py-2 rounded-full text-sm cursor-pointer ${period === "month" ? "bg-[#e5edff] text-gray-900" : "text-gray-500"}`}
            onClick={() => setPeriod("month")}
          >
            На месяц
          </button>
        </div>
        <div className="mb-5">
          <div className="text-[28px] font-extrabold text-[#1d4ed8] flex items-baseline gap-3">
            3990&nbsp;р/год
            <div className="text-sm text-gray-400 line-through">5980&nbsp;р/год</div>
          </div>
          <div className="mt-2 text-xl font-bold text-[#1d4ed8] flex items-baseline gap-2.5">
            322&nbsp;р/месяц
            <span className="text-sm text-gray-400 line-through">490&nbsp;р/месяц</span>
            <span className="text-sm text-green-600">Выгода 32%</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 mb-2">Выберите способ оплаты</div>
        <div className="flex gap-3 mt-2 max-md:flex-col">
          <button type="button" className="primary-btn flex-1 justify-center" onClick={() => { setSubscriptions((prev) => prev.map((s) => (s.id === activeModal?.id ? { ...s, status: s.purchasedStatus } : s))); setActiveModal(null); }}>Банковской картой</button>
          <button type="button" className="primary-outline-btn flex-1 justify-center" onClick={() => { setSubscriptions((prev) => prev.map((s) => (s.id === activeModal?.id ? { ...s, status: s.purchasedStatus } : s))); setActiveModal(null); }}>По QR-коду (СБП)</button>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(newsModalItem)}
        onClose={() => setNewsModalItem(null)}
        title={newsModalItem?.title}
        backdropClassName="items-end md:items-center"
        panelClassName="bg-white w-full md:w-[800px] md:rounded-[20px] rounded-t-[20px] md:rounded-b-[20px] flex flex-col overflow-hidden p-0"
        showHeader={false}
        showClose
      >
        <div className="w-full aspect-[360/226] lg:aspect-[800/356] overflow-hidden">
          <img src={newsModalItem?.image} alt={newsModalItem?.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col flex-1 gap-[16px] p-[16px] lg:p-[24px] lg:pt-[16px] text-center md:text-left text-[16px] lg:text-[20px] leading-[20px] lg:leading-[25px] text-[#1A1A1A] min-h-0">
          <div className="mt-auto font-light text-[#8D8D8D]">{newsModalItem?.date}</div>
          <h3 className="m-0 font-bold">{newsModalItem?.title}</h3>
          <div className="flex-1 overflow-y-auto">
            <p className="flex-1 m-0 font-light whitespace-pre-line">
              {newsModalItem?.description}
            </p>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(loginModalOpen)}
        onClose={() => setLoginModalOpen(false)}
        title="Войти"
        panelClassName="w-full max-w-[390px]"
        headerClassName="justify-center"
      >
        <button type="button" className="border-none bg-transparent p-0 mb-2 text-sm text-primary cursor-pointer">Зарегистрироваться</button>
        <form className="mt-1" onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label className="block text-[13px] text-gray-500 mb-1.5">Логин/Почта</label>
            <input className="input input-field" type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин/Почта" />
          </div>
          <div className="mb-4">
            <label className="block text-[13px] text-gray-500 mb-1.5">Пароль</label>
            <input className="input input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
          </div>
          <div className="flex justify-between items-center mt-1 mb-3">
            <label className="flex items-center gap-1.5 text-[13px] text-gray-600"><input type="checkbox" /> <span>Запомнить меня</span></label>
            <button type="button" className="link-button subtle text-[13px]">Я забыл пароль</button>
          </div>
          {loginError && <div className="text-[13px] text-red-600 mb-2">{loginError}</div>}
          <button type="submit" className="primary-btn w-full justify-center" disabled={isAuthLoading}>{isAuthLoading ? "Вход..." : "Войти"}</button>
        </form>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(deviceToRemove && isLk)}
        onClose={() => setDeviceToRemove(null)}
        title="Вы уверены, что хотите удалить устройство?"
        panelClassName="w-full max-w-[390px]"
        headerClassName="justify-center"
      >
        <p className="devices-hint mt-0 mb-4 text-center">Удалить привязанное устройство можно 1 раз в месяц</p>
        <div className="flex gap-3 mt-2 flex-col">
          <button type="button" className="primary-btn flex-1 justify-center" onClick={() => { setDevices((prev) => prev.filter((d) => d.name !== deviceToRemove?.name)); setDeviceToRemove(null); }}>Удалить устройство</button>
          <button type="button" className="primary-outline-btn flex-1 justify-center" onClick={() => setDeviceToRemove(null)}>Вернуться назад</button>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(logoutModalOpen)}
        onClose={() => setLogoutModalOpen(false)}
        title="Вы точно хотите выйти?"
        panelClassName="w-full max-w-[390px]"
        headerClassName="justify-center"
      >
        <div className="flex gap-3 mt-2 flex-col">
          <button type="button" className="primary-btn flex-1 justify-center" onClick={() => { handleLogout(); setLogoutModalOpen(false); }}>Выйти</button>
          <button type="button" className="primary-outline-btn flex-1 justify-center" onClick={() => setLogoutModalOpen(false)}>Отмена</button>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(historyModalOpen && isLk)}
        onClose={() => setHistoryModalOpen(false)}
        title="История платежей"
        panelClassName="max-w-[520px]"
      >
        <div className="flex justify-between items-center mb-3 text-sm">
          <span className="text-gray-500">Вы с нами</span>
          <span className="font-medium">4 года 2 месяца</span>
        </div>
        <div className="max-h-[360px] pr-1 overflow-y-auto flex flex-col gap-2.5">
          {HISTORY_ITEMS.map((item) => (
            <div className="bg-gray-50 rounded-2xl p-[14px_16px]" key={item.id}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="font-bold">{item.amount}</div>
                <div className="text-[13px] text-gray-500">{item.date}</div>
              </div>
              <div className="flex justify-between gap-4 text-[13px]">
                <div className="flex flex-col gap-0.5">
                  <div>{item.line1}</div>
                  <div className="text-gray-500">{item.line2}</div>
                </div>
                <div className="text-right flex flex-col gap-0.5">
                  <div className="text-gray-500">{item.sport}</div>
                  <div className="text-gray-500 text-xs">{item.methodLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseModal>
    </>
  );
}
