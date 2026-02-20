import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialSubscriptions, initialDevices } from "../data";
import {
  apiGetDevices,
  apiGetMe,
  apiLogin,
  apiLogout,
  apiRegister,
  apiRegisterDevice,
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
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [displayedNewsCount, setDisplayedNewsCount] = useState(8);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  const isLoggedIn = !!user;

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const me = await apiGetMe();
        setUser(me);
        const devs = await apiGetDevices();
        setDevices(devs);
      } catch {
        // не авторизован — это нормально
      }
    };
    bootstrap();
  }, []);

  const setLoginModalOpenSafe = (v) => setLoginModalOpen(v);

  const handleDownloadClick = () => setLoginModalOpen(true);

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

  const value = {
    user,
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
    setDemoLoggedIn
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
