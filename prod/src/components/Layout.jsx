import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  const location = useLocation();
  const path = location.pathname;
  const isHome = path === "/";
  const isLk = path === "/lk";
  const isAdmin = path === "/admin";
  const isContacts = path === "/contacts";
  const isDocuments = path === "/privacy" || path === "/terms";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const mainClass = isHome
    ? "flex-1 flex flex-col items-stretch pt-0 pb-[80px] md:pb-[160px]"
    : isLk || isAdmin
      ? "flex-1 pt-[40px] md:pt-[70px] pb-[80px] md:pb-[48px]"
      : isContacts
        ? "flex-1 pt-[40px] md:pt-[70px] pb-[40px] md:pb-[160px]"
        : isDocuments
          ? "flex-1 pt-[40px] md:pt-[70px] pb-[48px] md:pb-[50px]"
          : "flex-1 pt-[40px] md:pt-[70px] pb-[80px] md:pb-[160px]";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={mainClass}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
