import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logoIcon from "../assets/icons/logo.svg";
import logoWhiteIcon from "../assets/icons/logo-white.svg";

export function Footer() {
  const { isLoggedIn, setLoginModalOpen, setLogoutModalOpen, handleDownloadClick } = useApp();

  const handleProfileClick = () => {
    if (isLoggedIn) setLogoutModalOpen(true);
    else setLoginModalOpen(true);
  };

  const containerClass = "w-full max-w-[1868px] px-[24px] mx-auto";
  const navLinkClass = "w-[95px] p-0 border-none text-center text-[20px] font-light text-[#1A1A1A] bg-transparent cursor-pointer transition-colors hover:text-[#00459D] hover:font-bold";
  const bottomBlockClass = "text-[20px] leading-[25px] text-[#8D8D8D] font-light";
  const mobileFooterNavClass = "p-0 border-none text-[20px] leading-[25px] font-light text-[#FFF] bg-transparent cursor-pointer transition-colors active:text-[#D9E3F1]";

  return (
    <footer className="py-[24px] rounded-t-[16px] border-t border-t-[#F2F2F2] bg-[#00459D] text-[#FFF] md:pt-[22px] md:pb-[38px] md:rounded-none md:bg-white md:text-inherit">
      <div className={containerClass}>
        {/* ПК-версия */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-[60px]">
            <Link to="/" className="flex items-center p-0 border-none bg-transparent cursor-pointer">
              <img src={logoIcon} className="w-[174px] h-auto" alt="Tacticode" />
            </Link>
            <nav className="flex items-center gap-[64px]">
              <Link to="/news" className={navLinkClass}>Новости</Link>
              <Link to="/subscription" className={navLinkClass}>Подписка</Link>
              <Link to="/contacts" className={navLinkClass}>Контакты</Link>
            </nav>
            <div className="flex items-center gap-[40px]">
              <button type="button" className="inline-flex items-center gap-[16px] px-[40px] py-[16px] rounded-full border-none text-[20px] leading-[25px] font-light text-[#00459D] bg-[#F2F5FA] cursor-pointer transition-colors hover:bg-[#00459D] hover:text-[#FFFFFF] active:bg-[#003982] active:text-[#FFFFFF]" onClick={handleDownloadClick}>
                <span>Скачать</span>
                <svg className="w-[20px] h-auto shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.427 9.76873C19.1087 9.76873 18.854 10.0234 18.854 10.3417V15.554C18.854 16.9716 17.6995 18.1219 16.2861 18.1219H3.71392C2.29626 18.1219 1.14601 16.9674 1.14601 15.554V10.2568C1.14601 9.93851 0.891341 9.68384 0.573005 9.68384C0.254669 9.68384 0 9.93851 0 10.2568V15.554C0 17.604 1.66808 19.2679 3.71392 19.2679H16.2861C18.3362 19.2679 20 17.5998 20 15.554V10.3417C20 10.0276 19.7453 9.76873 19.427 9.76873Z" fill="currentColor"/>
                  <path d="M9.59683 14.7177C9.70719 14.8281 9.85575 14.8875 10.0001 14.8875C10.1444 14.8875 10.2929 14.8323 10.4033 14.7177L14.0451 11.076C14.27 10.851 14.27 10.4902 14.0451 10.2653C13.8201 10.0403 13.4593 10.0403 13.2344 10.2653L10.5731 12.9308V1.30518C10.5731 0.986847 10.3184 0.732178 10.0001 0.732178C9.68172 0.732178 9.42705 0.986847 9.42705 1.30518V12.9308L6.76152 10.2653C6.53656 10.0403 6.17578 10.0403 5.95082 10.2653C5.72587 10.4902 5.72587 10.851 5.95082 11.076L9.59683 14.7177Z" fill="currentColor"/>
                </svg>
              </button>
              <button type="button" className="flex items-center justify-center w-10 h-10 p-0 rounded-full border-none bg-transparent cursor-pointer text-[#D3D3D1]" aria-label="Профиль" onClick={handleProfileClick}>
                <svg className="w-full h-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M19.7149 19.2681C22.362 19.2681 24.6541 18.3187 26.527 16.4455C28.3999 14.5727 29.3493 12.2811 29.3493 9.63379C29.3493 6.98724 28.3999 4.69545 26.5267 2.82194C24.6535 0.949371 22.3617 0 19.7149 0C17.0675 0 14.7759 0.949371 12.9031 2.82225C11.0303 4.69514 10.0805 6.987 10.0805 9.63379C10.0805 12.2811 11.0302 14.573 12.9034 16.4459C14.7766 18.3184 17.0685 19.2681 19.7149 19.2681ZM36.5725 30.7579C36.5184 29.9786 36.4092 29.1282 36.2483 28.2305C36.086 27.3259 35.877 26.4708 35.6267 25.6893C35.3682 24.8815 35.0167 24.0838 34.5821 23.3193C34.1311 22.5259 33.6013 21.8349 33.0068 21.2664C32.3851 20.6716 31.624 20.1934 30.7439 19.8445C29.8669 19.4977 28.8948 19.3219 27.8551 19.3219C27.4468 19.3219 27.0519 19.4894 26.2893 19.9859C25.7472 20.3389 25.2034 20.6895 24.6581 21.0375C24.1341 21.3714 23.4243 21.6842 22.5475 21.9674C21.6921 22.2442 20.8236 22.3846 19.9663 22.3846C19.1092 22.3846 18.2409 22.2442 17.3846 21.9674C16.5088 21.6844 15.7989 21.3717 15.2755 21.0378C14.6685 20.6499 14.1193 20.2959 13.6429 19.9855C12.8811 19.4891 12.4859 19.3215 12.0776 19.3215C11.0376 19.3215 10.0659 19.4976 9.18912 19.8449C8.3096 20.1931 7.54819 20.6713 6.92593 21.2667C6.33179 21.8355 5.80172 22.5261 5.35125 23.3193C4.91703 24.0837 4.56547 24.8812 4.30664 25.6896C4.05664 26.4711 3.84766 27.3259 3.68532 28.2305C3.52446 29.1271 3.41524 29.9776 3.36118 30.7589C3.3074 31.5451 3.28074 32.3329 3.28126 33.1209C3.28126 35.2089 3.945 36.8992 5.25391 38.1459C6.54663 39.3761 8.2571 40.0002 10.3372 40.0002H29.5974C31.6775 40.0002 33.3873 39.3764 34.6804 38.1459C35.9896 36.9002 36.6533 35.2095 36.6533 33.1206C36.653 32.3146 36.6259 31.5196 36.5725 30.7579Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          <div className={`flex items-center justify-between ${bottomBlockClass}`}>
            <Link to="#" className="p-0 border-none bg-transparent cursor-pointer hover:underline">Политика конфиденциальности</Link>
            <p className="m-0 p-0">&copy;&nbsp;2025&nbsp;ООО &laquo;Спорттехлаб&raquo;. Все права защищены</p>
            <Link to="#" className="p-0 border-none bg-transparent cursor-pointer hover:underline">Пользовательское соглашение</Link>
          </div>
        </div>

        {/* Моб-версия */}
        <div className="block md:hidden">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center p-0 border-none bg-transparent cursor-pointer">
                <img src={logoWhiteIcon} alt="Tacticode" className="w-[105px] h-auto" />
              </Link>
              <button type="button" className="flex items-center justify-center w-[24px] h-auto p-0 rounded-full border-none bg-transparent cursor-pointer text-inherit" aria-label="Профиль" onClick={handleProfileClick}>
                <svg className="w-full h-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M19.7149 19.2681C22.362 19.2681 24.6541 18.3187 26.527 16.4455C28.3999 14.5727 29.3493 12.2811 29.3493 9.63379C29.3493 6.98724 28.3999 4.69545 26.5267 2.82194C24.6535 0.949371 22.3617 0 19.7149 0C17.0675 0 14.7759 0.949371 12.9031 2.82225C11.0303 4.69514 10.0805 6.987 10.0805 9.63379C10.0805 12.2811 11.0302 14.573 12.9034 16.4459C14.7766 18.3184 17.0685 19.2681 19.7149 19.2681ZM36.5725 30.7579C36.5184 29.9786 36.4092 29.1282 36.2483 28.2305C36.086 27.3259 35.877 26.4708 35.6267 25.6893C35.3682 24.8815 35.0167 24.0838 34.5821 23.3193C34.1311 22.5259 33.6013 21.8349 33.0068 21.2664C32.3851 20.6716 31.624 20.1934 30.7439 19.8445C29.8669 19.4977 28.8948 19.3219 27.8551 19.3219C27.4468 19.3219 27.0519 19.4894 26.2893 19.9859C25.7472 20.3389 25.2034 20.6895 24.6581 21.0375C24.1341 21.3714 23.4243 21.6842 22.5475 21.9674C21.6921 22.2442 20.8236 22.3846 19.9663 22.3846C19.1092 22.3846 18.2409 22.2442 17.3846 21.9674C16.5088 21.6844 15.7989 21.3717 15.2755 21.0378C14.6685 20.6499 14.1193 20.2959 13.6429 19.9855C12.8811 19.4891 12.4859 19.3215 12.0776 19.3215C11.0376 19.3215 10.0659 19.4976 9.18912 19.8449C8.3096 20.1931 7.54819 20.6713 6.92593 21.2667C6.33179 21.8355 5.80172 22.5261 5.35125 23.3193C4.91703 24.0837 4.56547 24.8812 4.30664 25.6896C4.05664 26.4711 3.84766 27.3259 3.68532 28.2305C3.52446 29.1271 3.41524 29.9776 3.36118 30.7589C3.3074 31.5451 3.28074 32.3329 3.28126 33.1209C3.28126 35.2089 3.945 36.8992 5.25391 38.1459C6.54663 39.3761 8.2571 40.0002 10.3372 40.0002H29.5974C31.6775 40.0002 33.3873 39.3764 34.6804 38.1459C35.9896 36.9002 36.6533 35.2095 36.6533 33.1206C36.653 32.3146 36.6259 31.5196 36.5725 30.7579Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <nav>
              <ul className="flex flex-col items-center gap-6">
                <li>
                  <Link to="/news" className={mobileFooterNavClass}>Новости</Link>
                </li>
                <li>
                  <Link to="/subscription" className={mobileFooterNavClass}>Подписка</Link>
                </li>
                <li>
                  <Link to="/contacts" className={mobileFooterNavClass}>Контакты</Link>
                </li>
              </ul>
            </nav>
            <div className="flex justify-center">
              <button type="button" className="inline-flex items-center justify-center gap-[12px] w-full px-6 py-3 rounded-full border-none text-[16px] leading-[20px] font-light text-[#00459D] bg-[#FFF] cursor-pointer transition-colors active:bg-[#D9E3F1]" onClick={handleDownloadClick}>
                <span>Скачать приложение</span>
                <svg className="w-4 h-auto shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.427 9.76873C19.1087 9.76873 18.854 10.0234 18.854 10.3417V15.554C18.854 16.9716 17.6995 18.1219 16.2861 18.1219H3.71392C2.29626 18.1219 1.14601 16.9674 1.14601 15.554V10.2568C1.14601 9.93851 0.891341 9.68384 0.573005 9.68384C0.254669 9.68384 0 9.93851 0 10.2568V15.554C0 17.604 1.66808 19.2679 3.71392 19.2679H16.2861C18.3362 19.2679 20 17.5998 20 15.554V10.3417C20 10.0276 19.7453 9.76873 19.427 9.76873Z" fill="currentColor"/>
                  <path d="M9.59683 14.7177C9.70719 14.8281 9.85575 14.8875 10.0001 14.8875C10.1444 14.8875 10.2929 14.8323 10.4033 14.7177L14.0451 11.076C14.27 10.851 14.27 10.4902 14.0451 10.2653C13.8201 10.0403 13.4593 10.0403 13.2344 10.2653L10.5731 12.9308V1.30518C10.5731 0.986847 10.3184 0.732178 10.0001 0.732178C9.68172 0.732178 9.42705 0.986847 9.42705 1.30518V12.9308L6.76152 10.2653C6.53656 10.0403 6.17578 10.0403 5.95082 10.2653C5.72587 10.4902 5.72587 10.851 5.95082 11.076L9.59683 14.7177Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center gap-[16px] text-center text-[16px] leading-[20px] font-light text-[#D3D3D1]">
              <Link to="#" className="p-0 border-none text-[16px] leading-[20px] font-light text-[#D3D3D1] bg-transparent cursor-pointer active:underline">Политика конфиденциальности</Link>
              <Link to="#" className="p-0 border-none text-[16px] leading-[20px] font-light text-[#D3D3D1] bg-transparent cursor-pointer active:underline">Пользовательское соглашение</Link>
              <p className="m-0 p-0">&copy;&nbsp;2025&nbsp;ООО &laquo;Спорттехлаб&raquo;. Все права защищены</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
