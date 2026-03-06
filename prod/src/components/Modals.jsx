import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  { id: 4, subscriptionId: "hockey", amount: "3990 р", date: "13.10.2025", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 5, subscriptionId: "hockey", amount: "3990 р", date: "13.10.2025", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 6, subscriptionId: "hockey", amount: "490 р", date: "13.10.2025", line1: "Куплено на 1 месяц", line2: "QR-код", methodLabel: "Способ оплаты" },
  { id: 7, subscriptionId: "hockey", amount: "3990 р", date: "13.10.2025", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 8, subscriptionId: "football", amount: "490 р", date: "13.10.2025", line1: "Куплено на 1 месяц", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 9, subscriptionId: "hockey", amount: "3990 р", date: "13.10.2025", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 10, subscriptionId: "hockey", amount: "490 р", date: "13.10.2025", line1: "Куплено на 1 месяц", line2: "QR-код", methodLabel: "Способ оплаты" },
  { id: 11, subscriptionId: "football", amount: "490 р", date: "13.10.2025", line1: "Куплено на 1 месяц", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 12, subscriptionId: "hockey", amount: "3990 р", date: "13.10.2025", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 13, subscriptionId: "hockey", amount: "3990 р", date: "13.10.2025", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 14, subscriptionId: "hockey", amount: "490 р", date: "13.10.2025", line1: "Куплено на 1 месяц", line2: "QR-код", methodLabel: "Способ оплаты" },
  { id: 15, subscriptionId: "hockey", amount: "3990 р", date: "13.10.2025", line1: "Куплено на 1 год", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" },
  { id: 16, subscriptionId: "football", amount: "490 р", date: "13.10.2025", line1: "Куплено на 1 месяц", line2: "Visa Сберкарта •• 9698", methodLabel: "Способ оплаты" }
];
const secondButtonClass =
  "w-full md:w-auto md:self-start flex justify-center items-center px-[40px] py-[16px] rounded-full border-none text-[20px] leading-[1.25] font-light text-[#00459D] bg-[#F2F5FA] cursor-pointer transition-colors md:hover:bg-[#00459D] md:hover:text-white active:bg-[#003982] active:text-white";
const primaryModalButtonClass =
  "w-full md:w-auto md:self-start flex justify-center items-center px-[40px] py-[16px] rounded-full border-none text-[20px] leading-[1.25] font-light text-white bg-[#00459D] cursor-pointer transition-colors md:hover:bg-[#F2F5FA] md:hover:text-[#00459D] active:bg-[#D9E3F1] active:text-[#00459D]";

/** Стили для синих текстовых ссылок во всех модалках */
const MODAL_LINK_CLASS = "p-0 border-none bg-transparent cursor-pointer text-[16px] md:text-[20px] leading-[1.25] font-light text-[#00459D] hover:text-[#003982] active:text-[#003982]";

/** Базовый шрифт для текста в модалках с формами (вход, регистрация, коды, восстановление) */
const MODAL_TEXT_FONT = "text-[16px] md:text-[20px] leading-[1.25] font-light";

/** Кастомный чекбокс: скрытый инпут + квадрат 24×24, скругление 4px, фон D9E3F1 / при выборе 00459D, отступ до надписи 8px */
const MODAL_CHECKBOX_WRAPPER = "relative inline-flex shrink-0 w-6 h-6";
const MODAL_CHECKBOX_INPUT = "peer absolute inset-0 w-6 h-6 opacity-0 cursor-pointer z-10";
const MODAL_CHECKBOX_BOX = "w-6 h-6 rounded-[4px] bg-[#D9E3F1] peer-checked:bg-[#00459D] shrink-0 pointer-events-none block";

/** Плавающий лейбл: обёртка и стили лейбла/инпута */
const MODAL_FLOATING_WRAPPER = "relative";
const MODAL_FLOATING_LABEL_PLACEHOLDER = "absolute left-[24px] pointer-events-none transition-all duration-200 top-1/2 -translate-y-1/2 text-[16px] md:text-[20px] leading-[1.25] font-light text-[#8D8D8D]";
const MODAL_FLOATING_LABEL_LIFTED = "absolute left-[24px] pointer-events-none transition-all duration-200 top-[8.5px] translate-y-0 text-[12px] text-[#8D8D8D]";
const MODAL_FLOATING_LABEL_LIFTED_ERROR = "absolute left-[24px] pointer-events-none transition-all duration-200 top-[8.5px] translate-y-0 text-[12px] text-[#FF383C]";
const MODAL_INPUT_BASE = "input input-field w-full pl-[24px] pr-14 pt-[23.5px] pb-[8.5px] text-[20px] leading-[1.25] font-light text-[#000] border-none outline-none rounded-full bg-[#F8F8F8] placeholder:opacity-0";
const INPUT_ERROR_CLASS = "bg-[#FFE3E3]";

const ClearFieldSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0">
    <rect x="3.05078" y="14.8638" width="2" height="16" rx="1" transform="rotate(-135 3.05078 14.8638)" fill="#8D8D8D"/>
    <rect x="1.63672" y="3.55029" width="2" height="16" rx="1" transform="rotate(-45 1.63672 3.55029)" fill="#8D8D8D"/>
  </svg>
);

function ModalFloatingInput({ label, value, onChange, type = "text", error, id, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  const str = value != null ? String(value) : "";
  const hasValue = str.length > 0;
  const lifted = focused || hasValue;
  const labelClass = lifted
    ? (error ? MODAL_FLOATING_LABEL_LIFTED_ERROR : MODAL_FLOATING_LABEL_LIFTED)
    : (error ? "absolute left-[24px] pointer-events-none transition-all duration-200 top-1/2 -translate-y-1/2 text-[16px] md:text-[20px] leading-[1.25] font-light text-[#FF383C]" : MODAL_FLOATING_LABEL_PLACEHOLDER);
  return (
    <div className={MODAL_FLOATING_WRAPPER}>
      <span className={labelClass}>{label}</span>
      <input
        id={id}
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={label}
        className={`${MODAL_INPUT_BASE} ${error ? INPUT_ERROR_CLASS : ""}`}
        {...inputProps}
      />
      {hasValue && (
        <button
          type="button"
          className="absolute right-[24px] top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 p-0 border-none bg-transparent cursor-pointer text-[#8D8D8D] hover:opacity-70 active:opacity-90"
          onClick={() => onChange("")}
          aria-label="Очистить поле"
        >
          <ClearFieldSvg />
        </button>
      )}
    </div>
  );
}

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
      {/* Вход / Регистрация */}
      <BaseModal
        isOpen={Boolean(loginModalOpen)}
        onClose={() => { setLoginModalOpen(false); setAuthMode("login"); }}
        title=""
        titleClassName="sr-only"
        panelClassName="w-full max-w-[390px]"
      >
        <div className="flex flex-col items-center gap-[8px] mb-[24px]">
          {authMode === "login" ? (
            <>
              <h3 className="mb-0 text-[20px] md:text-[24px] leading-[1.25] text-center font-bold">Войти</h3>
              <button type="button" className="p-0 border-none text-[16px] md:text-[20px] leading-[1.25] font-light text-[#00459D] bg-transparent cursor-pointer hover:text-[#003982] active:text-[#003982]" onClick={() => setAuthMode("register")}>Зарегистрироваться</button>
            </>
          ) : (
            <>
              <h3 className="mb-0 text-[20px] md:text-[24px] leading-[1.25] text-center font-bold">Зарегистрироваться</h3>
              <button type="button" className="p-0 border-none text-[16px] md:text-[20px] leading-[1.25] font-light text-[#00459D] bg-transparent cursor-pointer hover:text-[#003982] active:text-[#003982]" onClick={() => setAuthMode("login")}>Войти</button>
            </>
          )}
        </div>

        {authMode === "login" ? (
          <form className="flex flex-col gap-[16px] md:gap-[24px]" onSubmit={handleLoginSubmit}>
            <div className="">
              <ModalFloatingInput label="Логин/Почта" value={login} onChange={setLogin} type="text" error={!!loginError} />
            </div>
            <div className="">
              <ModalFloatingInput label="Пароль" value={password} onChange={setPassword} type="password" error={!!loginError} />
            </div>
            <div className="flex justify-between items-center">
              <label className={`flex items-center gap-2 text-[#8D8D8D] ${MODAL_TEXT_FONT} cursor-pointer select-none`}>
                <span className={MODAL_CHECKBOX_WRAPPER}>
                  <input type="checkbox" className={MODAL_CHECKBOX_INPUT} />
                  <span className={MODAL_CHECKBOX_BOX} aria-hidden />
                  <svg className="absolute inset-0 m-auto w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                <span>Запомнить меня</span>
              </label>
              <button
                type="button"
                className={`${MODAL_LINK_CLASS} !text-[#8D8D8D]`}
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
              <p className={`${MODAL_TEXT_FONT} text-center md:text-left`}>
                Неверный логин или пароль. Если не можете войти,{" "}
                <button
                  type="button"
                  className={`${MODAL_LINK_CLASS}`}
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
            <button type="submit" className={`${secondButtonClass} w-full md:w-full mt-[8px] md:mt-[16px] justify-center disabled:cursor-not-allowed disabled:opacity-70`} disabled={isAuthLoading}>{isAuthLoading ? "Вход..." : "Войти"}</button>
          </form>
        ) : (
          <div className="flex flex-col gap-[16px] md:gap-[24px]">
            <div className="">
              <ModalFloatingInput label="Логин/Почта" value={registerEmail} onChange={(v) => { setRegisterEmail(v); if (registerError) setRegisterError(""); }} type="email" error={!!registerError} />
            </div>
            <div className="">
              <ModalFloatingInput label="Пароль" value={registerPassword} onChange={(v) => { setRegisterPassword(v); if (registerError) setRegisterError(""); }} type="password" error={!!registerError} />
            </div>
            <div className="">
              <ModalFloatingInput label="Повторите пароль" value={registerPassword2} onChange={(v) => { setRegisterPassword2(v); if (registerError) setRegisterError(""); }} type="password" error={!!registerError} />
            </div>
            <label className={`flex items-center gap-2 text-[#8D8D8D] ${MODAL_TEXT_FONT} cursor-pointer select-none`}>
              <span className={MODAL_CHECKBOX_WRAPPER}>
                <input type="checkbox" className={MODAL_CHECKBOX_INPUT} />
                <span className={MODAL_CHECKBOX_BOX} aria-hidden />
                <svg className="absolute inset-0 m-auto w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              <span>Запомнить меня</span>
            </label>
            {registerError && (
              <p className={`m-0 mb-2 text-[#FF383C] ${MODAL_TEXT_FONT}`}>
                {registerError}
              </p>
            )}
            <button
              type="button"
              className={`${secondButtonClass} w-full md:w-full justify-center mt-[8px] md:mt-[16px] mb-0 disabled:cursor-not-allowed disabled:opacity-70`}
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
            <p className={`!text-[16px] text-[#8D8D8D] text-center md:text-left ${MODAL_TEXT_FONT}`}>
              Отправляя данные, вы соглашаетесь с нашей{" "}
              <Link to="/privacy" className={`!text-[16px] ${MODAL_LINK_CLASS}`} onClick={() => setLoginModalOpen(false)}>политикой конфиденциальности</Link>
              {" "}и{" "}
              <Link to="/terms" className={`!text-[16px] ${MODAL_LINK_CLASS}`} onClick={() => setLoginModalOpen(false)}>пользовательским соглашением</Link>
            </p>
          </div>
        )}
      </BaseModal>

      {/* Код с почты */}
      <BaseModal
        isOpen={codeModalOpen}
        onClose={() => { setCodeModalOpen(false); setCodeError(""); }}
        title="Введите код"
        panelClassName="w-full max-w-[390px]"
        titleClassName="text-center"
      >
        <p className={`m-0 mb-[24px] text-center text-[#8D8D8D] ${MODAL_TEXT_FONT}`}>
          Мы отправили код на указанную почту
        </p>
        <div className="mb-[24px]">
          <div className="flex flex-row justify-between gap-2 md:gap-[2px]">
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
                className={`flex-1 min-w-0 aspect-square md:flex-none md:w-[57px] md:h-[57px] rounded-full border-none outline-none px-0 text-center text-[20px] leading-[1.25] font-light ${
                  codeError ? "bg-[#FFE3E3] text-[#FF383C]" : "bg-[#F2F5FA]"
                }`}
              />
            ))}
          </div>
          {codeError && (
            <p className={`m-0 mt-2 text-[#FF383C] text-center text-[20px] leading-[1.25] font-light`}>
              {codeError}
            </p>
          )}
        </div>
        <button
          type="button"
          className={`${secondButtonClass} w-full md:w-full justify-center mb-0 disabled:cursor-not-allowed disabled:opacity-70`}
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
        <button type="button" className={`${MODAL_LINK_CLASS} ${MODAL_TEXT_FONT} mx-auto block mt-4`}>
          Отправить код еще раз
        </button>
      </BaseModal>
      
      {/* Восстановление: ввод почты */}
      <BaseModal
        isOpen={restoreModalOpen}
        onClose={() => setRestoreModalOpen(false)}
        title="Укажите почту"
        panelClassName="w-full max-w-[390px]"
        titleClassName="text-center"
      >
        <p className={`m-0 mb-[24px] md:mb-[32px] text-center text-[#8D8D8D] ${MODAL_TEXT_FONT}`}>
          Мы отправим на нее код подтверждения
        </p>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await handleRestoreSubmit(event);
          }}
        >
          <div className="mb-[24px] md:mb-[32px]">
            <ModalFloatingInput label="Логин/Почта" value={restoreEmail} onChange={(v) => { setRestoreEmail(v); if (restoreEmailError) setRestoreEmailError(""); }} type="email" error={!!restoreEmailError} />
            {restoreEmailError && (
              <p className={`m-0 mt-[8px] md:mt-[16px] text-center text-[#FF383C] ${MODAL_TEXT_FONT}`}>
                {restoreEmailError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`${secondButtonClass} w-full md:w-full justify-center disabled:cursor-not-allowed disabled:opacity-70`}
            disabled={restoreLoading}
          >
            {restoreLoading ? "Отправляем..." : "Отправить код"}
          </button>
        </form>
        <button
          type="button"
          className={`mt-[16px] md:mt-[24px] w-full flex items-center justify-center gap-1 border-none bg-transparent p-0 text-[#8D8D8D] cursor-pointer ${MODAL_TEXT_FONT}`}
          onClick={() => { setRestoreModalOpen(false); setLoginModalOpen(true); setAuthMode("login"); }}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden>
            <path d="M0.274981 6.47611L0.275824 6.477L5.17445 11.352C5.54143 11.7172 6.13501 11.7158 6.50031 11.3488C6.86556 10.9818 6.86415 10.3883 6.49717 10.023L3.20823 6.75L15.0625 6.75C15.5803 6.75 16 6.33028 16 5.8125C16 5.29472 15.5803 4.875 15.0625 4.875L3.20828 4.875L6.49712 1.602C6.86411 1.23675 6.86551 0.643175 6.50026 0.276191C6.13496 -0.0908871 5.54134 -0.0921526 5.1744 0.273004L0.275776 5.148L0.274933 5.14889C-0.0922394 5.51536 -0.0910664 6.11086 0.274981 6.47611Z" fill="#8D8D8D"/>
          </svg>
          <span>Вернуться назад</span>
        </button>
      </BaseModal>

      {/* Восстановление: новый пароль */}
      <BaseModal
        isOpen={newPasswordModalOpen}
        onClose={() => setNewPasswordModalOpen(false)}
        title="Придумайте новый пароль"
        panelClassName="w-full max-w-[390px]"
        titleClassName="text-center"
      >
        <p className={`m-0 mb-[24px] text-center text-[#8D8D8D] ${MODAL_TEXT_FONT}`}>
          Не забудьте его сохранить или записать
        </p>
        <div className="mb-[24px] md:mb-[40px]">
          <div className="mb-[16px] md:mb-[24px]">
            <ModalFloatingInput label="Новый пароль" value={newPassword} onChange={(v) => { setNewPassword(v); if (newPasswordError) setNewPasswordError(""); }} type="password" error={!!newPasswordError} />
          </div>
          <div>
            <ModalFloatingInput label="Повторите пароль" value={newPassword2} onChange={(v) => { setNewPassword2(v); if (newPasswordError) setNewPasswordError(""); }} type="password" error={!!newPasswordError} />
          </div>
          {newPasswordError && (
            <p className={`m-0 mt-[8px] md:mt-[16px] text-[#FF383C] ${MODAL_TEXT_FONT}`}>
              {newPasswordError}
            </p>
          )}
        </div>
        <button
          type="button"
          className={`${secondButtonClass} w-full md:w-full justify-center disabled:cursor-not-allowed disabled:opacity-70`}
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
      
      {/* Скачать прил */}
      <BaseModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Скачать Tacticode"
      >
        <p className={`mb-[16px] md:mb-[24px] text-center text-[#1A1A1A] ${MODAL_TEXT_FONT}`}>
          Удобно стройте тактику, стратегию, готовтесь к&nbsp;играм и&nbsp;тренировкам вместе с&nbsp;Tacticode
        </p>
        <p className={`mb-[16px] text-center text-[#8D8D8D] ${MODAL_TEXT_FONT}`}>
          Скачать для
        </p>
        <div className="flex flex-col gap-[16px] pb-[16px] md:pb-[24px]">
          {["Windows 7", "Windows 10", "Windows 11"].map((label) => (
            <button
              key={label}
              type="button"
              className={`${secondButtonClass} w-full md:w-full`}
              onClick={() => setDownloadModalOpen(false)}
            >
              {label}
            </button>
          ))}
        </div>
        <svg className="w-full h-[2px] shrink-0" viewBox="0 0 425 2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect width="425" height="2" rx="1" fill="url(#download-modal-divider)" />
          <defs>
            <linearGradient id="download-modal-divider" x1="0" y1="1" x2="425" y2="1" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F2F5FA" stopOpacity="0.15" />
              <stop offset="0.503748" stopColor="#F2F5FA" />
              <stop offset="1" stopColor="#F2F5FA" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex flex-col gap-[16px] mt-[16px] md:mt-[24px]">
          <button
            type="button"
            className={`${secondButtonClass} w-full md:w-full`}
            onClick={() => setDownloadModalOpen(false)}
          >
            Mac OS
          </button>
        </div>
      </BaseModal>

      {/* Новость */}
      <BaseModal
        isOpen={Boolean(newsModalItem)}
        onClose={() => setNewsModalItem(null)}
        title={newsModalItem?.title}
        titleClassName="sr-only"
        panelClassName="!max-w-[880px] !p-0"
        long
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="shrink-0 w-full aspect-[360/226] lg:aspect-[800/356] rounded-[16px] md:rounded-[20px_20px_0_0] overflow-hidden">
            <img src={newsModalItem?.image} alt={newsModalItem?.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col flex-1 min-h-0 gap-[8px] md:gap-[16px] p-[16px_16px_0_16px] lg:p-[24px_24px_0_24px]">
            <p className="shrink-0 text-[16px] md:text-[20px] leading-[1.25] font-light text-[#8D8D8D]">{newsModalItem?.date}</p>
            <h3 className="shrink-0 text-[16px] md:text-[24px] leading-[1.25] font-bold text-[#1A1A1A]">{newsModalItem?.title}</h3>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <p className="pb-[16px] md:pb-[24px] text-[16px] md:text-[24px] leading-[1.25] font-light text-[#1A1A1A]">
                {newsModalItem?.description}
              </p>
            </div>
          </div>
        </div>
      </BaseModal>

      {/* Купить подписку */}
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
            <div className="flex max-md:flex-col justify-between gap-[8px] md:gap-[24px]">
              <button type="button" className={secondButtonClass} onClick={() => { setSubscriptions((prev) => prev.map((s) => (s.id === activeModal?.id ? { ...s, status: s.purchasedStatus } : s))); setActiveModal(null); }}>Банковской картой</button>
              <button type="button" className={secondButtonClass} onClick={() => { setSubscriptions((prev) => prev.map((s) => (s.id === activeModal?.id ? { ...s, status: s.purchasedStatus } : s))); setActiveModal(null); }}>По QR-коду (СБП)</button>
            </div>
          </div>
        </div>
      </BaseModal>

      {/* Удалить устройство */}
      <BaseModal
        isOpen={Boolean(deviceToRemove && isLk)}
        onClose={() => setDeviceToRemove(null)}
        title="Вы уверены, что хотите удалить устройство?"
        panelClassName="w-full !max-w-[444px]"
        titleClassName="md:!mb-[16px]"
      >
        <p className={`${MODAL_TEXT_FONT} m-0 mb-[24px] text-center text-[#8D8D8D]`}>
          Удалить привязанное устройство можно 1 раз в месяц
        </p>
        <div className="flex flex-col gap-[16px]">
          <button
            type="button"
            className={`${secondButtonClass} w-full md:w-full`}
            onClick={() => {
              setDevices((prev) => prev.filter((d) => d.name !== deviceToRemove?.name));
              setDeviceToRemove(null);
            }}
          >
            Удалить устройство
          </button>
          <button
            type="button"
            className={`${secondButtonClass} w-full md:w-full`}
            onClick={() => setDeviceToRemove(null)}
          >
            Вернуться назад
          </button>
        </div>
      </BaseModal>

      {/* История платежей */}
      <BaseModal
        isOpen={Boolean(historyModalOpen && isLk)}
        onClose={() => setHistoryModalOpen(false)}
        title="История платежей"
        long
        panelClassName="!max-w-[550px]"
        titleClassName="mb-[16px] md:mb-[24px] md:text-left"
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="shrink-0 flex justify-between items-center mb-[16px]">
            <span className={`${MODAL_TEXT_FONT} lg:text-[24px] text-[#8D8D8D]`}>Вы с нами</span>
            <span className={`${MODAL_TEXT_FONT} lg:text-[24px] text-[#1A1A1A]`}>4 года 2 месяца</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex flex-col gap-[16px] pb-[16px] md:pb-[24px]">
              {HISTORY_ITEMS.map((item) => {
                const purchaseTermValue = item.line1.replace(/^Куплено на\s*/u, "");
                const subscriptionName = getSubscriptionName(item.subscriptionId);

                return (
                  <div className="rounded-[16px] bg-[#F8F8F8] p-[24px]" key={item.id}>
                    <div className="flex flex-col gap-[16px]">
                      <div className="flex items-center justify-between gap-[16px] md:hidden">
                        <div className="text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">{item.amount}</div>
                        <div className="text-right text-[20px] leading-[1.25] font-bold text-[#8D8D8D]">{subscriptionName}</div>
                      </div>
                      <div className="hidden md:flex items-start justify-between gap-[16px]">
                        <div className="text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">{item.amount}</div>
                        <div className={`${MODAL_TEXT_FONT} text-right text-[#1A1A1A]`}>{item.date}</div>
                      </div>
                      <div className="flex items-start justify-between gap-[16px] md:hidden">
                        <div className="flex flex-col gap-[4px]">
                          <span className={`${MODAL_TEXT_FONT} text-[#8D8D8D]`}>Куплено на</span>
                          <span className={`${MODAL_TEXT_FONT} text-[#1A1A1A]`}>{purchaseTermValue}</span>
                        </div>
                        <div className="flex flex-col items-end gap-[4px] text-right">
                          <span className={`${MODAL_TEXT_FONT} text-[#8D8D8D]`}>Дата покупки</span>
                          <span className={`${MODAL_TEXT_FONT} text-[#1A1A1A]`}>{item.date}</span>
                        </div>
                      </div>
                      <div className="hidden md:flex items-start justify-between gap-[16px]">
                        <div className="flex items-start gap-[8px]">
                          <span className={`${MODAL_TEXT_FONT} text-[#8D8D8D]`}>Куплено на</span>
                          <span className={`${MODAL_TEXT_FONT} text-[#1A1A1A]`}>{purchaseTermValue}</span>
                        </div>
                        <div className="text-right text-[20px] leading-[1.25] font-light text-[#8D8D8D]">{subscriptionName}</div>
                      </div>
                      <div className="flex flex-col gap-[4px] md:flex-row-reverse md:items-start md:justify-between md:gap-[16px]">
                        <span className={`${MODAL_TEXT_FONT} text-[#8D8D8D]`}>{item.methodLabel}</span>
                        <span className={`${MODAL_TEXT_FONT} text-[#1A1A1A]`}>{item.line2}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </BaseModal>
            
      {/* Выйти */}
      <BaseModal
        isOpen={Boolean(logoutModalOpen)}
        onClose={() => setLogoutModalOpen(false)}
        title="Вы уверены, что хотите выйти из аккаунта?"
        panelClassName="w-full !max-w-[444px]"
        titleClassName="!mb-[24px]"
      >
        <div className="flex flex-col gap-[16px]">
          <button type="button" className={`${primaryModalButtonClass} w-full md:w-full`} onClick={() => { handleLogout(); setLogoutModalOpen(false); }}>Выйти из аккаунта</button>
          <button type="button" className={`${secondButtonClass} w-full md:w-full`} onClick={() => setLogoutModalOpen(false)}>Вернуться назад</button>
        </div>
      </BaseModal>
    </>
  );
}
