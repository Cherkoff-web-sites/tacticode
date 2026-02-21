import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  const location = useLocation();
  const path = location.pathname;
  const isHome = path === "/";
  const isLk = path === "/lk";
  const isContent = path === "/news" || path === "/subscription" || path === "/contacts";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const mainClass = isHome
    ? "flex-1 flex flex-col items-stretch pt-0 pb-[80px] md:pb-[160px]"
    : isLk
      ? "flex-1 py-8 px-10 pb-10"
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
