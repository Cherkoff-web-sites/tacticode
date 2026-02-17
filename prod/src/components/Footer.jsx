import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logoIcon from "../assets/icons/logo.svg";
import downloadIcon from "../assets/icons/download.svg";
import lkIcon from "../assets/icons/lk.svg";

export function Footer() {
  const { isLoggedIn, setLoginModalOpen, handleDownloadClick } = useApp();

  const containerClass = "max-w-[1820px] mx-auto px-10";

  return (
    <footer className="mt-auto py-4 bg-white text-[13px] text-gray-500">
      <div className={containerClass}>
        <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start max-md:gap-4">
          <div className="flex flex-col gap-2 max-md:order-1">
            <Link to="/" className="flex items-center border-none bg-transparent p-0 cursor-pointer">
              <img src={logoIcon} alt="Tacticode" className="h-10" />
            </Link>
            <button type="button" className="border-none bg-transparent p-0 text-[13px] text-gray-400 cursor-pointer text-left">
              Политика конфиденциальности
            </button>
          </div>
          <div className="flex flex-col items-center gap-2 max-md:items-start max-md:order-2">
            <nav className="flex gap-[18px]">
              <Link to="/news" className="text-gray-500">Новости</Link>
              <Link to="/subscription" className="text-gray-500">Подписка</Link>
              <Link to="/contacts" className="text-gray-500">Контакты</Link>
            </nav>
            <div className="text-xs">© 2025 ООО «Спорттехлаб». Все права защищены</div>
          </div>
          <div className="flex flex-col items-end gap-2 max-md:items-start max-md:order-3">
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex items-center gap-2 px-[18px] py-2 rounded-full border-none bg-[#eef2ff] text-gray-900 text-sm cursor-pointer hover:bg-[#e0e7ff] transition-colors" onClick={handleDownloadClick}>
                <span>Скачать</span>
                <img src={downloadIcon} alt="" className="w-5 h-5" />
              </button>
              {isLoggedIn ? (
                <Link to="/lk" className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer p-0 flex items-center justify-center hover:opacity-80 transition-opacity" aria-label="Профиль">
                  <img src={lkIcon} alt="Личный кабинет" className="w-10 h-10" />
                </Link>
              ) : (
                <button type="button" className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer p-0 flex items-center justify-center hover:opacity-80 transition-opacity" aria-label="Профиль" onClick={() => setLoginModalOpen(true)}>
                  <img src={lkIcon} alt="Личный кабинет" className="w-10 h-10" />
                </button>
              )}
            </div>
            <button type="button" className="border-none bg-transparent p-0 text-[13px] text-gray-400 cursor-pointer">
              Пользовательское соглашение
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
