import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_DEVICES } from "../LkPage.mock";
import {
  apiGetDevices,
  apiGetMe,
  apiLogin,
  apiLogout,
  apiRegisterDevice,
  apiUpdateProfileDetails,
  apiUpdateMyPassword,
  apiGetSubscriptions,
  apiGetSubscriptionHistory,
  apiActivateSubscription,
} from "../api/client";

const AppContext = createContext(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [devices, setDevices] = useState(MOCK_DEVICES);
  const [activeModal, setActiveModal] = useState(null);
  const [period, setPeriod] = useState("year");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [deviceToRemove, setDeviceToRemove] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [displayedNewsCount, setDisplayedNewsCount] = useState(8);
  const [newsModalItem, setNewsModalItem] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codePurpose, setCodePurpose] = useState(null); // 'register' | 'reset' | 'change_login'
  const [codeEmail, setCodeEmail] = useState("");
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const isLoggedIn = !!user;

  // Бэк отдаёт sportId; для карточек в ЛК нужен id (тот же ключ, что в subscriptionItems)
  const normalizeSubs = (subs) =>
    (subs || []).map((s) => ({
      ...s,
      dbId: s.dbId ?? (typeof s.id === "number" ? s.id : undefined),
      id: s.sportId ?? s.id,
    }));

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const me = await apiGetMe();
        setUser(me);
        const devs = await apiGetDevices();
        setDevices(devs);
        const [subs, history] = await Promise.all([
          apiGetSubscriptions(),
          apiGetSubscriptionHistory(),
        ]);
        setSubscriptions(normalizeSubs(subs).map(enrichSubscription));
        setSubscriptionHistory(history);
      } catch {
        // не авторизован — это нормально
      }
    };
    bootstrap();
  }, []);

  // Подписки: бесплатный период с тестовой длительностью (год = 2 минуты, месяц = 1 минута)
  const enrichSubscription = (sub) => {
    if (!sub.startedAt || !sub.expiresAt) {
      return {
        ...sub,
        status: "inactive",
        purchasedStatus: "active",
        since: "",
        until: "",
        details: "Подписка неактивна",
      };
    }

    const now = Date.now();
    const startMs = new Date(sub.startedAt).getTime();
    const endMs = new Date(sub.expiresAt).getTime();
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
      return {
        ...sub,
        status: "inactive",
        purchasedStatus: "active",
        since: "",
        until: "",
        details: "Подписка неактивна",
      };
    }

    const totalMs = Math.max(endMs - startMs, 1);
    const remainingMs = Math.max(endMs - now, 0);

    let status = "inactive";
    let details = "Подписка неактивна";

    if (remainingMs <= 0) {
      status = "expired";
      details = "Подписка истекла";
    } else {
      const remainingSeconds = Math.floor(remainingMs / 1000);
      const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
      const ss = String(remainingSeconds % 60).padStart(2, "0");
      details = `Осталось ${mm}:${ss}`;

      const warningThresholdMs = totalMs * 0.15;
      status = remainingMs <= warningThresholdMs ? "warning" : "active";
    }

    const formatter = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Moscow",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const sinceLabel = `Активна с ${formatter.format(startMs)}`;
    const untilLabel = formatter.format(endMs);

    return {
      ...sub,
      status,
      purchasedStatus: "active",
      since: sinceLabel,
      until: untilLabel,
      details,
    };
  };

  // Тик обновления таймера подписок (каждую секунду)
  useEffect(() => {
    if (!subscriptions.length) return undefined;
    const id = setInterval(() => {
      setSubscriptions((prev) => prev.map(enrichSubscription));
    }, 1000);
    return () => clearInterval(id);
  }, [subscriptions.length]);

  const activateSubscription = async ({ subscriptionId, period, method }) => {
    try {
      const data = await apiActivateSubscription({
        sportId: subscriptionId,
        plan: period,
        method,
      });
      setSubscriptions(normalizeSubs(data?.subscriptions || []).map(enrichSubscription));
      setSubscriptionHistory(data?.history || []);
    } catch (err) {
      console.error("Failed to activate subscription:", err);
      throw err;
    }
  };

  const setLoginModalOpenSafe = (v) => setLoginModalOpen(v);

  const handleDownloadClick = () => setDownloadModalOpen(true);

  const handleLogout = () => {
    apiLogout();
    setUser(null);
    navigate("/");
  };

  // Для превью: переключить состояние "залогинен" без бэкенда
  const setDemoLoggedIn = (v) => {
    setUser(v ? { id: 1 } : null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsAuthLoading(true);
    try {
      const identifier = login;
      const loggedUser = await apiLogin({ identifier, password });
      setUser(loggedUser);
      setLoginModalOpen(false);
      setPassword("");

      // регистрируем устройство
      try {
        const ua = navigator.userAgent || "";
        const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
        const deviceName = ua.slice(0, 120);
        const deviceType = isMobile ? "mobile" : "desktop";
        await apiRegisterDevice({ deviceName, deviceType });
        const devs = await apiGetDevices();
        setDevices(devs);
      } catch (err) {
        console.warn("Не удалось зарегистрировать устройство:", err?.message || err);
      }

      navigate("/lk");
    } catch (err) {
      setLoginError(err.message || "Ошибка авторизации");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const saveProfileDetails = async ({ surname, firstName, birthDate, club }) => {
    const updatedUser = await apiUpdateProfileDetails({ surname, firstName, birthDate, club });
    setUser(updatedUser);
    return updatedUser;
  };

  const changeMyPassword = async ({ password: nextPassword }) => {
    const updatedUser = await apiUpdateMyPassword({ password: nextPassword });
    setUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    setUser,
    isLoggedIn,
    loginModalOpen,
    setLoginModalOpen: setLoginModalOpenSafe,
    login,
    setLogin,
    password,
    setPassword,
    loginError,
    isAuthLoading,
    authMode,
    setAuthMode,
    handleLoginSubmit,
    handleDownloadClick,
    handleLogout,
    subscriptions,
    setSubscriptions,
    subscriptionHistory,
    setSubscriptionHistory,
    devices,
    setDevices,
    activeModal,
    setActiveModal,
    period,
    setPeriod,
    deviceToRemove,
    setDeviceToRemove,
    historyModalOpen,
    setHistoryModalOpen,
    logoutModalOpen,
    setLogoutModalOpen,
    displayedNewsCount,
    setDisplayedNewsCount,
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
    activateSubscription,
    saveProfileDetails,
    changeMyPassword,
    setDemoLoggedIn
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
