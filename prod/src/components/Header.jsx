import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logoIcon from "../assets/icons/logo.svg";
import downloadIcon from "../assets/icons/download.svg";
import lkIcon from "../assets/icons/lk.svg";
import burgerIcon from "../assets/icons/burger.svg";

export function Header() {
  const { isLoggedIn, setLoginModalOpen, handleDownloadClick } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY || window.pageYOffset;
      const last = lastScrollYRef.current;

      // Скрываем шапку при скролле вниз, показываем при скролле вверх
      if (current > last + 10 && current > 80) {
        setIsHidden(true);
      } else if (current < last - 10) {
        setIsHidden(false);
      }

      lastScrollYRef.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerClass = "max-w-[1820px] mx-auto px-4 md:px-10";

  const navLinkClass = "border-none bg-transparent p-0 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors text-sm";

  return (
    <header
      className={`bg-white border-b-[1px_solid_#F2F2F2] sticky top-0 z-10 transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className={containerClass}>
        <div className="flex items-center justify-between h-18">
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="flex items-center border-none bg-transparent p-0 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
              <img src={logoIcon} alt="Tacticode" className="w-[174px] h-auto" />
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link to="/news" className={navLinkClass}>Новости</Link>
              <Link to="/subscription" className={navLinkClass}>Подписка</Link>
              <Link to="/contacts" className={navLinkClass}>Контакты</Link>
            </nav>
          </div>

          <div className="flex md:hidden items-center justify-between w-full">
            <button type="button" className="p-2 border-none bg-transparent cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Меню">
              <img src={burgerIcon} alt="Меню" className="w-6 h-[18px]" />
            </button>
            <Link to="/" className="flex items-center border-none bg-transparent p-0 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
              <img src={logoIcon} alt="Tacticode" className="w-[29.1667vw] h-auto" />
            </Link>
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

          <div className="hidden md:flex items-center gap-4">
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
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col py-4">
            <Link to="/news" className="px-4 py-3 text-left text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Новости</Link>
            <Link to="/subscription" className="px-4 py-3 text-left text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Подписка</Link>
            <Link to="/contacts" className="px-4 py-3 text-left text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Контакты</Link>
            <button type="button" className="mx-4 mt-2 inline-flex items-center justify-center gap-2 px-[18px] py-2 rounded-full border-none bg-[#eef2ff] text-gray-900 text-sm cursor-pointer hover:bg-[#e0e7ff] transition-colors" onClick={() => { handleDownloadClick(); setMobileMenuOpen(false); }}>
              <span>Скачать</span>
              <img src={downloadIcon} alt="" className="w-5 h-5" />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
