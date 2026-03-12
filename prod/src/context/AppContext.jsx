import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  apiAdminRequestCode,
  apiGetDevices,
  apiGetAdminUserDetails,
  apiGetAdminUsers,
  apiGetMe,
  apiLogin,
  apiLogout,
  apiRegisterDevice,
  apiDeleteAdminUser,
  apiUpdateProfileDetails,
  apiUpdateMyPassword,
  apiGetSubscriptions,
  apiGetSubscriptionHistory,
  apiActivateSubscription,
} from "../api/client";

const AppContext = createContext(null);
const SUPER_ADMIN_EMAIL = String(
  import.meta.env.VITE_SUPER_ADMIN_EMAIL || "danilcherkov44@gmail.com"
).trim().toLowerCase();

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [devices, setDevices] = useState([]);
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
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [isAdminUsersLoading, setIsAdminUsersLoading] = useState(false);

  const isLoggedIn = !!user;

  // Бэк отдаёт sportId; для карточек в ЛК нужен id (тот же ключ, что в subscriptionItems)
  const normalizeSubs = (subs) =>
    (subs || []).map((s) => ({
      ...s,
      dbId: s.dbId ?? (typeof s.id === "number" ? s.id : undefined),
      id: s.sportId ?? s.id,
    }));

  const clearAuthorizedData = () => {
    setSubscriptions([]);
    setSubscriptionHistory([]);
    setDevices([]);
    setAdminUsers([]);
    setActiveModal(null);
    setDeviceToRemove(null);
  };

  const loadAuthorizedData = async ({ includeUser = false } = {}) => {
    const requests = [
      apiGetDevices(),
      apiGetSubscriptions(),
      apiGetSubscriptionHistory(),
    ];

    if (includeUser) {
      requests.unshift(apiGetMe());
    }

    const results = await Promise.all(requests);

    const me = includeUser ? results[0] : null;
    const devicesResult = includeUser ? results[1] : results[0];
    const subsResult = includeUser ? results[2] : results[1];
    const historyResult = includeUser ? results[3] : results[2];

    if (me) {
      setUser(me);
    }

    setDevices(devicesResult || []);
    setSubscriptions(normalizeSubs(subsResult).map(enrichSubscription));
    setSubscriptionHistory(historyResult || []);

    return {
      user: me,
      devices: devicesResult || [],
      subscriptions: subsResult || [],
      history: historyResult || [],
    };
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadAuthorizedData({ includeUser: true });
      } catch {
        apiLogout();
        setUser(null);
        clearAuthorizedData();
      } finally {
        setIsAuthResolved(true);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !["/lk", "/admin"].includes(location.pathname)) return;

    loadAuthorizedData({ includeUser: true }).catch((err) => {
      console.error("Failed to refresh LK data:", err);
      apiLogout();
      setUser(null);
      clearAuthorizedData();
    });
  }, [isLoggedIn, location.pathname]);

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

  const registerCurrentDevice = async () => {
    const ua = navigator.userAgent || "";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const deviceName = ua.slice(0, 120);
    const deviceType = isMobile ? "mobile" : "desktop";
    await apiRegisterDevice({ deviceName, deviceType });
  };

  const handleLogout = () => {
    apiLogout();
    setUser(null);
    clearAuthorizedData();
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
      const identifier = String(login || "").trim();
      const normalizedIdentifier = identifier.toLowerCase();
      if (normalizedIdentifier === SUPER_ADMIN_EMAIL) {
        await apiAdminRequestCode({ email: normalizedIdentifier });
        setCodePurpose("admin_login");
        setCodeEmail(normalizedIdentifier);
        setCodeModalOpen(true);
        setLoginModalOpen(false);
        setPassword("");
        return;
      }

      const loggedUser = await apiLogin({ identifier, password });
      setUser(loggedUser);
      setLoginModalOpen(false);
      setPassword("");

      // регистрируем устройство
      try {
        await registerCurrentDevice();
      } catch (err) {
        console.warn("Не удалось зарегистрировать устройство:", err?.message || err);
      }

      await loadAuthorizedData({ includeUser: true });

      navigate("/lk");
    } catch (err) {
      setLoginError(err.message || "Ошибка авторизации");
      clearAuthorizedData();
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    if (user?.role !== "super_admin") {
      setAdminUsers([]);
      return [];
    }

    setIsAdminUsersLoading(true);
    try {
      const users = await apiGetAdminUsers();
      setAdminUsers(users);
      return users;
    } finally {
      setIsAdminUsersLoading(false);
    }
  };

  const getAdminUserDetails = async (id) => apiGetAdminUserDetails(id);

  const removeAdminUser = async (id) => {
    await apiDeleteAdminUser(id);
    setAdminUsers((prev) => prev.filter((item) => item.id !== id));
  };

  const saveProfileDetails = async ({ surname, firstName, birthDate, club }) => {
    const updatedUser = await apiUpdateProfileDetails({ surname, firstName, birthDate, club });
    setUser(updatedUser);
    await loadAuthorizedData();
    return updatedUser;
  };

  const changeMyPassword = async ({ password: nextPassword }) => {
    const updatedUser = await apiUpdateMyPassword({ password: nextPassword });
    setUser(updatedUser);
    await loadAuthorizedData();
    return updatedUser;
  };

  const value = {
    user,
    setUser,
    isLoggedIn,
    isAuthResolved,
    adminUsers,
    isAdminUsersLoading,
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
    loadAuthorizedData,
    loadAdminUsers,
    getAdminUserDetails,
    removeAdminUser,
    registerCurrentDevice,
    saveProfileDetails,
    changeMyPassword,
    setDemoLoggedIn
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
