import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  const location = useLocation();
  const path = location.pathname;
  const isHome = path === "/";
  const isLk = path === "/lk";
  const isContent = path === "/news" || path === "/subscription" || path === "/contacts";

  const mainClass = isHome
    ? "flex-1 pt-0 pb-[80px] md:pb-[160px] flex flex-col items-stretch"
    : isLk
      ? "flex-1 py-8 px-10 pb-10"
      : "flex-1 py-8 pb-10";

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
