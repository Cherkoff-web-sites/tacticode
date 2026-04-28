import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { subscriptionItems } from "../data";
import BaseModal from "./BaseModal";
import {
  apiAdminConfirmCode,
  apiConfirmLoginChange,
  apiPasswordRequestReset,
  apiPasswordReset,
  apiPasswordVerifyCode,
  apiRegisterConfirm,
  apiRegisterRequestCode,
} from "../api/client";

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
  const [showPassword, setShowPassword] = useState(false);
  const str = value != null ? String(value) : "";
  const hasValue = str.length > 0;
  const lifted = focused || hasValue;
  const labelClass = lifted
    ? (error ? MODAL_FLOATING_LABEL_LIFTED_ERROR : MODAL_FLOATING_LABEL_LIFTED)
    : (error ? "absolute left-[24px] pointer-events-none transition-all duration-200 top-1/2 -translate-y-1/2 text-[16px] md:text-[20px] leading-[1.25] font-light text-[#FF383C]" : MODAL_FLOATING_LABEL_PLACEHOLDER);
  const isPassword = type === "password";
  const effectiveType = isPassword && showPassword ? "text" : type;
  const inputPaddingClass = isPassword ? "!pr-[96px]" : "";

  return (
    <div className={MODAL_FLOATING_WRAPPER}>
      <span className={labelClass}>{label}</span>
      <input
        id={id}
        type={effectiveType}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={label}
        className={`${MODAL_INPUT_BASE} ${inputPaddingClass} ${error ? INPUT_ERROR_CLASS : ""}`}
        {...inputProps}
      />
      {isPassword && hasValue && (
        <button
          type="button"
          className={`group/eye absolute right-[56px] top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 p-0 border-none bg-transparent cursor-pointer ${showPassword ? "text-[#00459D]" : "text-[#8D8D8D] lg:group-hover/eye:text-[#00459D] active:text-[#00459D]"}`}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" aria-hidden>
            <path d="M9 3.63525C5.56091 3.63525 2.44216 5.51681 0.140841 8.57296C-0.0469469 8.82335 -0.0469469 9.17315 0.140841 9.42353C2.44216 12.4834 5.56091 14.3649 9 14.3649C12.4391 14.3649 15.5578 12.4834 17.8592 9.42721C18.0469 9.17683 18.0469 8.82703 17.8592 8.57665C15.5578 5.51681 12.4391 3.63525 9 3.63525ZM9.2467 12.7779C6.96379 12.9215 5.07855 11.04 5.22215 8.75339C5.33998 6.86815 6.86806 5.34007 8.7533 5.22224C11.0362 5.07864 12.9214 6.9602 12.7778 9.24679C12.6563 11.1283 11.1283 12.6564 9.2467 12.7779ZM9.13256 11.0326C7.90273 11.1099 6.88647 10.0974 6.96747 8.86753C7.03007 7.85127 7.85486 7.03016 8.87113 6.96388C10.101 6.88656 11.1172 7.89914 11.0362 9.12896C10.9699 10.1489 10.1451 10.97 9.13256 11.0326Z" fill="currentColor"/>
          </svg>
        </button>
      )}
      {hasValue && (
        <button
          type="button"
          className="absolute right-[24px] top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 p-0 border-none bg-transparent cursor-pointer text-[#8D8D8D] lg:hover:opacity-70 active:opacity-90"
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
    user,
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
    deviceToRemove,
    setDeviceToRemove,
    removeDevice,
    subscriptionHistory,
    historyModalOpen,
    setHistoryModalOpen,
    logoutModalOpen,
    setLogoutModalOpen,
    newsModalItem,
    setNewsModalItem,
    codeModalOpen,
    setCodeModalOpen,
    codePurpose,
    setCodePurpose,
    codeEmail,
    setCodeEmail,
    downloadModalOpen,
    setDownloadModalOpen,
    handleLogout,
    activateSubscription,
    loadAuthorizedData,
    registerCurrentDevice,
  } = useApp();

  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const codeInputsRef = useRef([]);
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState("");
  const [restoreEmailError, setRestoreEmailError] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [deviceRemoveError, setDeviceRemoveError] = useState("");
  const [deviceRemoveLoading, setDeviceRemoveLoading] = useState(false);

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
      const data = await apiPasswordRequestReset({ identifier: email });
      setResetEmail(data?.email || email);
      setCodePurpose("reset");
      setCodeEmail(data?.email || email);
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

  const subscriptionNameMap = new Map(subscriptionItems.map((item) => [item.id, item.name]));
  const getSubscriptionName = (id) =>
    subscriptions.find((s) => s.id === id)?.name || subscriptionNameMap.get(id) || "Подписка";

  const historyDateFormatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const getPlanLabel = (plan) => (plan === "year" ? "1 год" : "1 месяц");

  /** Как в модалке покупки подписки: «Банковской картой» / «По QR-коду (СБП)». */
  const getHistoryPaymentMethodLabel = (method) => {
    if (method === "card") return "Банковской картой";
    if (method === "qr") return "По QR-коду (СБП)";
    return "Онлайн";
  };

  const pluralizeRu = (value, one, few, many) => {
    const abs = Math.abs(value) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return many;
    if (last > 1 && last < 5) return few;
    if (last === 1) return one;
    return many;
  };

  const formatMembershipDuration = (registeredAt) => {
    if (!registeredAt) return "0 дней";
    const start = new Date(registeredAt);
    if (Number.isNaN(start.getTime())) return "0 дней";

    const now = new Date();
    let months =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());

    if (now.getDate() < start.getDate()) {
      months -= 1;
    }

    if (months < 0) months = 0;

    if (months >= 12) {
      const years = Math.floor(months / 12);
      const remainMonths = months % 12;
      return remainMonths > 0
        ? `${years} ${pluralizeRu(years, "год", "года", "лет")} ${remainMonths} ${pluralizeRu(remainMonths, "месяц", "месяца", "месяцев")}`
        : `${years} ${pluralizeRu(years, "год", "года", "лет")}`;
    }

    if (months >= 1) {
      const anchor = new Date(start);
      anchor.setMonth(anchor.getMonth() + months);
      const diffDays = Math.max(Math.floor((now - anchor) / (1000 * 60 * 60 * 24)), 0);
      return diffDays > 0
        ? `${months} ${pluralizeRu(months, "месяц", "месяца", "месяцев")} ${diffDays} ${pluralizeRu(diffDays, "день", "дня", "дней")}`
        : `${months} ${pluralizeRu(months, "месяц", "месяца", "месяцев")}`;
    }

    const diffDays = Math.max(Math.floor((now - start) / (1000 * 60 * 60 * 24)), 0);
    return `${diffDays} ${pluralizeRu(diffDays, "день", "дня", "дней")}`;
  };

  const historyItems = (subscriptionHistory || []).map((item) => ({
    id: item.id,
    subscriptionId: item.sportId,
    amount: `${item.amountRub ?? 0} р`,
    date: item.createdAt ? historyDateFormatter.format(new Date(item.createdAt)) : "",
    line1: `Куплено на ${getPlanLabel(item.plan)}`,
    line2: getHistoryPaymentMethodLabel(item.method),
    methodLabel: "Способ оплаты",
  }));
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isAnyModalOpen]);

  useEffect(() => {
    if (codeModalOpen) {
      setCodeDigits(["", "", "", "", "", ""]);
      setCodeError("");
    }
  }, [codeModalOpen]);

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
                {loginError}
                {(loginError === "Неверный пароль" || loginError === "Ошибка авторизации") && (
                  <>
                    {" "}Если не можете войти,{" "}
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
                  </>
                )}
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
                await registerCurrentDevice();
                await loadAuthorizedData({ includeUser: true });
                setCodeModalOpen(false);
                setAuthMode("login");
                navigate("/lk");
              } else if (codePurpose === "reset") {
                await apiPasswordVerifyCode({ email: resetEmail, code });
                setResetCode(code);
                setCodeModalOpen(false);
                setNewPasswordModalOpen(true);
              } else if (codePurpose === "change_login") {
                const user = await apiConfirmLoginChange({ login: codeEmail, code });
                setUser(user);
                setCodeModalOpen(false);
              } else if (codePurpose === "admin_login") {
                const user = await apiAdminConfirmCode({ email: codeEmail, code });
                setUser(user);
                await registerCurrentDevice();
                await loadAuthorizedData({ includeUser: true });
                setCodeModalOpen(false);
                setLoginModalOpen(false);
                setPassword("");
                navigate("/admin");
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
          {codeLoading ? "Проверяем..." : codePurpose === "reset" ? "Продолжить" : codePurpose === "change_login" ? "Подтвердить" : codePurpose === "admin_login" ? "Войти в админку" : "Зарегистрироваться"}
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
            <ModalFloatingInput label="Логин/Почта" value={restoreEmail} onChange={(v) => { setRestoreEmail(v); if (restoreEmailError) setRestoreEmailError(""); }} type="text" error={!!restoreEmailError} />
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
              await registerCurrentDevice();
              await loadAuthorizedData({ includeUser: true });
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
              <button
                type="button"
                className={secondButtonClass}
                onClick={() => {
                  if (activeModal?.id) {
                    activateSubscription({ subscriptionId: activeModal.id, period, method: "card" });
                  }
                  setActiveModal(null);
                }}
              >
                Банковской картой
              </button>
              <button
                type="button"
                className={secondButtonClass}
                onClick={() => {
                  if (activeModal?.id) {
                    activateSubscription({ subscriptionId: activeModal.id, period, method: "qr" });
                  }
                  setActiveModal(null);
                }}
              >
                По QR-коду (СБП)
              </button>
            </div>
          </div>
        </div>
      </BaseModal>

      {/* Удалить устройство */}
      <BaseModal
        isOpen={Boolean(deviceToRemove && isLk)}
        onClose={() => {
          setDeviceToRemove(null);
          setDeviceRemoveError("");
        }}
        title={deviceToRemove?.isCurrentDevice ? "Вы уверены, что хотите удалить текущее устройство?" : "Вы уверены, что хотите удалить устройство?"}
        panelClassName="w-full !max-w-[444px]"
        titleClassName="md:!mb-[16px]"
      >
        <p className={`${MODAL_TEXT_FONT} m-0 mb-[24px] text-center text-[#8D8D8D]`}>
          Удалить привязанное устройство можно 1 раз в 10 минут
        </p>
        {deviceRemoveError && (
          <p className={`${MODAL_TEXT_FONT} m-0 mb-[16px] text-center text-[#FF383C]`}>
            {deviceRemoveError}
          </p>
        )}
        <div className="flex flex-col gap-[16px]">
          <button
            type="button"
            className={`${secondButtonClass} w-full md:w-full disabled:cursor-not-allowed disabled:opacity-70`}
            disabled={deviceRemoveLoading}
            onClick={async () => {
              if (!deviceToRemove?.id) return;
              setDeviceRemoveError("");
              setDeviceRemoveLoading(true);
              try {
                await removeDevice(deviceToRemove.id);
                setDeviceToRemove(null);
              } catch (err) {
                setDeviceRemoveError(err?.message || "Не удалось удалить устройство");
              } finally {
                setDeviceRemoveLoading(false);
              }
            }}
          >
            {deviceRemoveLoading
              ? "Удаляем..."
              : deviceToRemove?.isCurrentDevice
                ? "Удалить текущее устройство"
                : "Удалить устройство"}
          </button>
          <button
            type="button"
            className={`${secondButtonClass} w-full md:w-full`}
            onClick={() => {
              setDeviceToRemove(null);
              setDeviceRemoveError("");
            }}
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
            <span className={`${MODAL_TEXT_FONT} lg:text-[24px] text-[#1A1A1A]`}>{formatMembershipDuration(user?.registeredAt)}</span>
        </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {historyItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-[16px] md:gap-[32px] py-[24px] text-center">
                <p className={`${MODAL_TEXT_FONT} m-0 text-[#8D8D8D] max-w-[290px]`}>
                  Вы еще не совершали покупок
                </p>
                <button
                  type="button"
                  className={`${primaryModalButtonClass} md:self-center`}
                  onClick={() => {
                    setHistoryModalOpen(false);
                    navigate("/subscription");
                  }}
                >
                  Купить подписку
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-[16px] pb-[16px] md:pb-[24px]">
                {historyItems.map((item) => {
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
            )}
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
