import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import BaseModal from "./BaseModal";
import {
  apiPasswordRequestReset,
  apiPasswordReset,
  apiPasswordVerifyCode,
  apiRegisterConfirm,
  apiRegisterRequestCode,
} from "../api/client";

const HISTORY_ITEMS = [
  { id: 1, subscriptionId: "hockey", amount: "3990 р", date: "13.10.2025", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 2, subscriptionId: "hockey", amount: "490 р", date: "13.10.2025", line1: "Куплено на 1 месяц", line2: "QR-код", methodLabel: "Способ оплаты" },
  { id: 3, subscriptionId: "football", amount: "490 р", date: "13.10.2025", line1: "Куплено на 1 месяц", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 4, subscriptionId: "hockey", amount: "3990 р", date: "13.10.2025", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" }
];
const paymentButtonClass =
  "w-full md:w-auto md:self-start flex justify-center md:justify-start px-[40px] py-[12px] lg:py-[16px] rounded-full border-none text-[16px] lg:text-[20px] leading-[20px] lg:leading-[25px] font-light text-[#00459D] bg-[#F2F5FA] cursor-pointer transition-colors md:hover:bg-[#00459D] md:hover:text-white active:bg-[#003982] active:text-white";

export function Modals() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLk = location.pathname === "/lk";
  const {
    loginModalOpen,
    setLoginModalOpen,
    authMode,
    setAuthMode,
    login,
    setLogin,
    password,
    setPassword,
    loginError,
    isAuthLoading,
    handleLoginSubmit,
    setUser,
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
    codeModalOpen,
    setCodeModalOpen,
    downloadModalOpen,
    setDownloadModalOpen,
    handleLogout
  } = useApp();

  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const codeInputsRef = useRef([]);
  const [codePurpose, setCodePurpose] = useState(null); // 'register' | 'reset'
  const [codeEmail, setCodeEmail] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState("");
  const [restoreEmailError, setRestoreEmailError] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);

  const [newPasswordModalOpen, setNewPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [newPasswordLoading, setNewPasswordLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPassword2, setRegisterPassword2] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleCodeChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    if (value && !digit) return;

    setCodeDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < 5) {
      const nextInput = codeInputsRef.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  
  const handleCodeKeyDown = (index, event) => {
    const { key } = event;

    if (key === "Backspace" || key === "Delete") {
      event.preventDefault();
      setCodeDigits((prev) => {
        const next = [...prev];
        if (next[index]) {
          next[index] = "";
        } else if (index > 0) {
          const prevIndex = index - 1;
          next[prevIndex] = "";
          const prevInput = codeInputsRef.current[prevIndex];
          if (prevInput) prevInput.focus();
        }
        return next;
      });
      return;
    }

    if (key === "ArrowLeft" && index > 0) {
      const prevInput = codeInputsRef.current[index - 1];
      if (prevInput) prevInput.focus();
    }

    if (key === "ArrowRight" && index < 5) {
      const nextInput = codeInputsRef.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleRestoreSubmit = async (event) => {
    event.preventDefault();
    setRestoreEmailError("");

    const email = restoreEmail.trim();
    if (!email) {
      setRestoreEmailError("Укажите почту");
      return;
    }

    try {
      setRestoreLoading(true);
      await apiPasswordRequestReset({ email });
      setResetEmail(email);
      setCodePurpose("reset");
      setCodeEmail(email);
      setCodeDigits(["", "", "", "", "", ""]);
      setCodeError("");
      setRestoreModalOpen(false);
      setCodeModalOpen(true);
    } catch (err) {
      setRestoreEmailError(
        err?.message || "К указанной почте не привязан ни один аккаунт. Проверьте правильность написания"
      );
    } finally {
      setRestoreLoading(false);
    }
  };

  const isAnyModalOpen = Boolean(
    loginModalOpen ||
    activeModal ||
    deviceToRemove ||
    logoutModalOpen ||
    historyModalOpen ||
    newsModalItem ||
    codeModalOpen ||
    downloadModalOpen ||
    restoreModalOpen ||
    newPasswordModalOpen
  );

  const subscriptionTitle =
    activeModal?.title ||
    subscriptions.find((s) => s.id === activeModal?.id)?.name ||
    "Подписка";

  const getSubscriptionName = (id) =>
    subscriptions.find((s) => s.id === id)?.name || "Подписка";

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
        panelClassName="!max-w-[590px]"
        title={subscriptionTitle}
        titleClassName="md:mb-[16px] text-[20px] md:text-[20px] md:text-left"
      >
        <p className="mb-[8px] text-[16px] md:text-[20px] leading-[1.25] font-light text-center md:text-left text-[#8D8D8D]">Выберите длительность подписки</p>
        <div className="flex flex-col gap-[20px] md:gap-[26px] h-full">
          <div className="inline-flex justify-between gap-[48px] w-full md:w-auto md:self-start p-[8px] md:px-[20px] md:py-[12px] rounded-full bg-[#F8F8F8]">
            <button
              type="button"
              className={`px-[16px] md:px-[20px] py-[8px] md:py-[12px] rounded-full border-none text-[16px] md:text-[20px] leading-[1.25] font-light cursor-pointer ${period === "year" ? "bg-[#D9E3F1]" : "bg-transparent"}`}
              onClick={() => setPeriod("year")}
            >
              На год
            </button>
            <button
              type="button"
              className={`px-[16px] md:px-[20px] py-[8px] md:py-[12px] rounded-full border-none text-[16px] md:text-[20px] leading-[1.25] font-light cursor-pointer ${period === "month" ? "bg-[#D9E3F1]" : "bg-transparent"}`}
              onClick={() => setPeriod("month")}
            >
              На месяц
            </button>
          </div>
          <div className="flex max-md:justify-center md:min-h-[96px] h-full">
            {period === "year" ? (
              <div className="flex flex-1 flex-col items-center md:items-start justify-center gap-[8px] md:gap-[16px] max-md:max-w-[242px]">
                <div className="flex items-baseline max-md:justify-center gap-[16px] flex-wrap">
                  <p className="h2 m-0 text-[#00459D]">
                    3990&nbsp;р/год
                  </p>
                  <p className="text-[16px] md:text-[20px] leading-[1.25] font-light text-[#8D8D8D] line-through">5980&nbsp;р/год</p>
                </div>

                <div className="flex items-baseline max-md:justify-center gap-[16px] flex-wrap">
                  <p className="h2 m-0 text-[#00459D]">
                    322&nbsp;р/месяц
                  </p>
                  <p className="text-[16px] md:text-[20px] leading-[1.25] font-light text-[#8D8D8D] line-through">490&nbsp;р/месяц</p>
                  <p className="text-[16px] md:text-[20px] leading-[1.25] font-bold md:font-light text-[#1A1A1A]">Выгода 32%</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center md:items-start justify-center gap-[8px] md:gap-[16px] max-md:max-w-[242px]">
                <p className="h2 m-0 text-[#00459D]">
                  490&nbsp;р/месяц
                </p>
              </div>
            )}
          </div>
          <div className="">
            <p className="mb-[8px] text-[16px] md:text-[20px] leading-[1.25] font-light text-center md:text-left text-[#8D8D8D]">Выберите способ оплаты</p>
            <div className="flex max-md:flex-col gap-[8px] md:gap-[24px]">
              <button type="button" className={paymentButtonClass} onClick={() => { setSubscriptions((prev) => prev.map((s) => (s.id === activeModal?.id ? { ...s, status: s.purchasedStatus } : s))); setActiveModal(null); }}>Банковской картой</button>
              <button type="button" className={paymentButtonClass} onClick={() => { setSubscriptions((prev) => prev.map((s) => (s.id === activeModal?.id ? { ...s, status: s.purchasedStatus } : s))); setActiveModal(null); }}>По QR-коду (СБП)</button>
            </div>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={restoreModalOpen}
        onClose={() => setRestoreModalOpen(false)}
        title="Укажите почту"
        panelClassName="w-full max-w-[390px]"
        titleClassName="text-center"
      >
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await handleRestoreSubmit(event);
          }}
        >
          <div className="mb-4">
            <label className="block text-[13px] text-gray-500 mb-1.5">Логин/Почта</label>
            <input
              className={`input input-field ${restoreEmailError ? "bg-[#FFE3E3] text-[#FF383C]" : ""}`}
              type="email"
              value={restoreEmail}
              onChange={(e) => { setRestoreEmail(e.target.value); if (restoreEmailError) setRestoreEmailError(""); }}
              placeholder="Логин/Почта"
            />
          </div>
          {restoreEmailError && (
            <p className="m-0 mb-3 text-[13px] leading-[16px] text-[#FF383C]">
              {restoreEmailError}
            </p>
          )}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-[12px] px-6 py-3 rounded-full border-none text-[16px] leading-[20px] font-light text-[#00459D] bg-[#F2F5FA] cursor-pointer transition-colors disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#B0B0B0]"
            disabled={restoreLoading}
          >
            {restoreLoading ? "Отправляем..." : "Отправить код"}
          </button>
        </form>
        <button
          type="button"
          className="mt-4 border-none bg-transparent p-0 text-[14px] leading-[18px] text-[#8D8D8D] cursor-pointer"
          onClick={() => { setRestoreModalOpen(false); setLoginModalOpen(true); setAuthMode("login"); }}
        >
          ← Вернуться назад
        </button>
      </BaseModal>

      <BaseModal
        isOpen={newPasswordModalOpen}
        onClose={() => setNewPasswordModalOpen(false)}
        title="Придумайте новый пароль"
        panelClassName="w-full max-w-[390px]"
        titleClassName="text-center"
      >
        <p className="m-0 mb-4 text-center text-[14px] leading-[18px] text-[#8D8D8D]">
          Не забудьте его сохранить или записать
        </p>
        <div className="mb-4">
          <label className="block text-[13px] text-gray-500 mb-1.5">Новый пароль</label>
          <input
            className={`input input-field ${newPasswordError ? "bg-[#FFE3E3] text-[#FF383C]" : ""}`}
            type="password"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); if (newPasswordError) setNewPasswordError(""); }}
            placeholder="Новый пароль"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[13px] text-gray-500 mb-1.5">Повторите пароль</label>
          <input
            className={`input input-field ${newPasswordError ? "bg-[#FFE3E3] text-[#FF383C]" : ""}`}
            type="password"
            value={newPassword2}
            onChange={(e) => { setNewPassword2(e.target.value); if (newPasswordError) setNewPasswordError(""); }}
            placeholder="Повторите пароль"
          />
        </div>
        {newPasswordError && (
          <p className="m-0 mb-4 text-[13px] leading-[16px] text-[#FF383C]">
            {newPasswordError}
          </p>
        )}
        <button
          type="button"
          className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full border-none text-[16px] leading-[20px] font-light text-white bg-[#00459D] cursor-pointer transition-colors disabled:bg-[#F2F5FA] disabled:text-[#C0C7D1] disabled:cursor-not-allowed"
          disabled={newPasswordLoading}
          onClick={async () => {
            if (!newPassword || !newPassword2) {
              setNewPasswordError("Заполните оба поля");
              return;
            }
            if (newPassword !== newPassword2) {
              setNewPasswordError("Пароли не совпадают");
              return;
            }
            try {
              setNewPasswordLoading(true);
              const user = await apiPasswordReset({ email: resetEmail, code: resetCode, password: newPassword });
              setUser(user);
              setNewPasswordModalOpen(false);
              navigate("/lk");
            } catch (err) {
              setNewPasswordError(err.message || "Не удалось обновить пароль");
            } finally {
              setNewPasswordLoading(false);
            }
          }}
        >
          {newPasswordLoading ? "Сохраняем..." : "Войти"}
        </button>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(newsModalItem)}
        onClose={() => setNewsModalItem(null)}
        title={newsModalItem?.title}
        long
        panelClassName="bg-white w-full md:w-[800px] md:rounded-[20px] rounded-t-[20px] md:rounded-b-[20px] flex flex-col overflow-hidden p-0"
        showClose
        titleClassName="sr-only"
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
        onClose={() => { setLoginModalOpen(false); setAuthMode("login"); }}
        title=""
        panelClassName="w-full max-w-[390px]"
        titleClassName="sr-only"
      >
        <div className="flex flex-col items-center gap-2 mb-4 text-[16px] leading-[20px]">
          <button
            type="button"
            className={`border-none bg-transparent p-0 cursor-pointer ${authMode === "login" ? "text-[#00459D] font-bold" : "text-[#8D8D8D]"}`}
            onClick={() => setAuthMode("login")}
          >
            Войти
          </button>
          <button
            type="button"
            className={`border-none bg-transparent p-0 cursor-pointer ${authMode === "register" ? "text-[#00459D] font-bold" : "text-[#8D8D8D]"}`}
            onClick={() => setAuthMode("register")}
          >
            Зарегистрироваться
          </button>
        </div>

        {authMode === "login" ? (
          <form className="mt-1" onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label className="block text-[13px] text-gray-500 mb-1.5">Логин/Почта</label>
              <input
                className={`input input-field ${loginError ? "bg-[#FFE3E3] text-[#FF383C]" : ""}`}
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Логин/Почта"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[13px] text-gray-500 mb-1.5">Пароль</label>
              <input
                className={`input input-field ${loginError ? "bg-[#FFE3E3] text-[#FF383C]" : ""}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
              />
            </div>
            <div className="flex justify-between items-center mt-1 mb-3">
              <label className="flex items-center gap-1.5 text-[13px] text-gray-600"><input type="checkbox" /> <span>Запомнить меня</span></label>
              <button
                type="button"
                className="link-button subtle text-[13px]"
                onClick={() => {
                  setRestoreEmail(login || "");
                  setRestoreEmailError("");
                  setLoginModalOpen(false);
                  setAuthMode("login");
                  setRestoreModalOpen(true);
                }}
              >
                Я забыл пароль
              </button>
            </div>
            {loginError && (
              <p className="m-0 mb-2 text-[13px] leading-[16px] text-[#FF383C]">
                Неверный логин или пароль. Если не можете войти,{" "}
                <button
                  type="button"
                  className="border-none bg-transparent p-0 text-[#00459D] cursor-pointer underline"
                  onClick={() => {
                    setRestoreEmail(login || "");
                    setRestoreEmailError("");
                    setLoginModalOpen(false);
                    setAuthMode("login");
                    setRestoreModalOpen(true);
                  }}
                >
                  восстановите доступ
                </button>
              </p>
            )}
            <button type="submit" className="primary-btn w-full justify-center" disabled={isAuthLoading}>{isAuthLoading ? "Вход..." : "Войти"}</button>
          </form>
        ) : (
          <div className="mt-1">
            <div className="mb-4">
              <label className="block text-[13px] text-gray-500 mb-1.5">Логин/Почта</label>
              <input
                className={`input input-field ${registerError ? "bg-[#FFE3E3] text-[#FF383C]" : ""}`}
                type="email"
                value={registerEmail}
                onChange={(e) => { setRegisterEmail(e.target.value); if (registerError) setRegisterError(""); }}
                placeholder="Логин/Почта"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[13px] text-gray-500 mb-1.5">Пароль</label>
              <input
                className={`input input-field ${registerError ? "bg-[#FFE3E3] text-[#FF383C]" : ""}`}
                type="password"
                value={registerPassword}
                onChange={(e) => { setRegisterPassword(e.target.value); if (registerError) setRegisterError(""); }}
                placeholder="Пароль"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[13px] text-gray-500 mb-1.5">Повторите пароль</label>
              <input
                className={`input input-field ${registerError ? "bg-[#FFE3E3] text-[#FF383C]" : ""}`}
                type="password"
                value={registerPassword2}
                onChange={(e) => { setRegisterPassword2(e.target.value); if (registerError) setRegisterError(""); }}
                placeholder="Повторите пароль"
              />
            </div>
            <div className="flex items-center gap-1.5 mb-4 text-[13px] text-gray-600">
              <input type="checkbox" />
              <span>Запомнить меня</span>
            </div>
            {registerError && (
              <p className="m-0 mb-2 text-[13px] leading-[16px] text-[#FF383C]">
                {registerError}
              </p>
            )}
            <button
              type="button"
              className="primary-btn w-full justify-center mb-3"
              disabled={registerLoading}
              onClick={async () => {
                setRegisterError("");
                const email = registerEmail.trim();
                if (!email || !registerPassword || !registerPassword2) {
                  setRegisterError("Заполните все поля");
                  return;
                }
                if (registerPassword !== registerPassword2) {
                  setRegisterError("Пароли не совпадают");
                  return;
                }
                try {
                  setRegisterLoading(true);
                  await apiRegisterRequestCode({ email, password: registerPassword });
                  setCodePurpose("register");
                  setCodeEmail(email);
                  setCodeDigits(["", "", "", "", "", ""]);
                  setCodeError("");
                  setLoginModalOpen(false);
                  setCodeModalOpen(true);
                } catch (err) {
                  setRegisterError(err.message || "Ошибка регистрации");
                } finally {
                  setRegisterLoading(false);
                }
              }}
            >
              {registerLoading ? "Отправляем..." : "Отправить код"}
            </button>
            <p className="m-0 text-[11px] leading-[14px] text-gray-400 text-left">
              Отправляя данные, вы соглашаетесь с нашей{" "}
              <button type="button" className="link-button p-0 text-[11px]">политикой конфиденциальности</button>
              {" "}и{" "}
              <button type="button" className="link-button p-0 text-[11px]">пользовательским соглашением</button>
            </p>
          </div>
        )}
      </BaseModal>

      <BaseModal
        isOpen={codeModalOpen}
        onClose={() => { setCodeModalOpen(false); setCodeError(""); }}
        title="Введите код"
        panelClassName="w-full max-w-[390px]"
        titleClassName="text-center"
      >
        <p className="m-0 mb-3 text-center text-[14px] leading-[18px] text-[#8D8D8D]">
          Мы отправили код на указанную почту
        </p>
        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              ref={(el) => {
                codeInputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={codeDigits[i]}
              onChange={(e) => handleCodeChange(i, e.target.value)}
              onKeyDown={(e) => handleCodeKeyDown(i, e)}
              className={`w-[32px] h-[32px] rounded-full text-center text-[16px] leading-[20px] border-none outline-none ${
                codeError ? "bg-[#FFE3E3] text-[#FF383C]" : "bg-[#F2F5FA]"
              }`}
            />
          ))}
        </div>
        {codeError && (
          <p className="m-0 mb-2 text-[13px] leading-[16px] text-[#FF383C] text-center">
            {codeError}
          </p>
        )}
        <button
          type="button"
          className="primary-btn w-full justify-center mb-2"
          disabled={codeLoading}
          onClick={async () => {
            const code = codeDigits.join("");
            if (code.length !== 6) {
              setCodeError("Введите 6-значный код");
              return;
            }
            try {
              setCodeLoading(true);
              if (codePurpose === "register") {
                const user = await apiRegisterConfirm({ email: codeEmail, code });
                setUser(user);
                setCodeModalOpen(false);
                setAuthMode("login");
                navigate("/lk");
              } else if (codePurpose === "reset") {
                await apiPasswordVerifyCode({ email: resetEmail, code });
                setResetCode(code);
                setCodeModalOpen(false);
                setNewPasswordModalOpen(true);
              } else {
                setCodeError("Неизвестный тип кода");
              }
            } catch (err) {
              setCodeError(err.message || "Неверный код");
            } finally {
              setCodeLoading(false);
            }
          }}
        >
          {codeLoading ? "Проверяем..." : codePurpose === "reset" ? "Продолжить" : "Зарегистрироваться"}
        </button>
        <button type="button" className="border-none bg-transparent p-0 mx-auto block text-sm text-[#00459D] cursor-pointer">
          Отправить код еще раз
        </button>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(deviceToRemove && isLk)}
        onClose={() => setDeviceToRemove(null)}
        title="Вы уверены, что хотите удалить устройство?"
        panelClassName="w-full max-w-[390px]"
        titleClassName="text-center"
      >
        <p className="m-0 mb-4 text-center text-[14px] leading-[18px] text-[#8D8D8D]">
          Удалить привязанное устройство можно 1 раз в месяц
        </p>
        <div className="flex flex-col gap-[12px] mt-2">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full border-none text-[16px] leading-[20px] font-light text-[#00459D] bg-[#F2F5FA] cursor-pointer transition-colors active:bg-[#D9E3F1]"
            onClick={() => {
              setDevices((prev) => prev.filter((d) => d.name !== deviceToRemove?.name));
              setDeviceToRemove(null);
            }}
          >
            Удалить устройство
          </button>
          <button
            type="button"
            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full border-none text-[16px] leading-[20px] font-light text-[#8D8D8D] bg-[#F2F5FA] cursor-pointer transition-colors active:bg-[#E5E7EB]"
            onClick={() => setDeviceToRemove(null)}
          >
            Вернуться назад
          </button>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(logoutModalOpen)}
        onClose={() => setLogoutModalOpen(false)}
        title="Вы точно хотите выйти?"
        panelClassName="w-full max-w-[390px]"
        titleClassName="text-center"
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
        long
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
                  <div className="text-gray-500">{getSubscriptionName(item.subscriptionId)}</div>
                  <div className="text-gray-500 text-xs">{item.methodLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseModal>

      <BaseModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Скачать Tacticode"
      >
        <p className="m-0 mb-4 text-center text-[16px] leading-[20px] font-light text-[#1A1A1A]">
          Удобно стройте тактику, стратегию, готовьтесь к играм и тренировкам вместе с Tacticode
        </p>
        <p className="m-0 mb-4 text-center text-[16px] leading-[20px] font-light text-[#8D8D8D]">
          Скачать для
        </p>
        <div className="flex flex-col gap-[12px]">
          {["Windows 7", "Windows 10", "Windows 11", "Mac OS"].map((label) => (
            <button
              key={label}
              type="button"
              className="w-full px-6 py-3 rounded-full border-none text-[16px] leading-[20px] font-light text-[#00459D] bg-[#F2F5FA] cursor-pointer transition-colors md:hover:bg-[#00459D] md:hover:text-white active:bg-[#D9E3F1]"
              onClick={() => setDownloadModalOpen(false)}
            >
              {label}
            </button>
          ))}
        </div>
      </BaseModal>
    </>
  );
}
