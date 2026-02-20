import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import qrImage from "../assets/images/qr.png";
import qrImageMob from "../assets/images/qr_mob.png";

const STEPS = [
  { text: "1. Зарегистрируйтесь в личном кабинете на сайте", btn: "Зарегистрироваться", needLogin: true },
  { text: "2. Оформите подписку — без неё доступ к приложению будет закрыт", btn: "Оформить подписку", link: "/subscription" },
  { text: "3. Скачайте приложение для вашего компьютера", btn: "Скачать приложение", needDownload: true },
  { text: "4. Установите его и войдите в аккаунт, используя данные из личного кабинета" }
];

const containerClass = "w-full max-w-[1868px] px-[24px] mx-auto";
const startBtnClass = "w-full md:w-auto md:self-start flex justify-center md:justify-start px-[40px] py-[12px] lg:py-[16px] rounded-full border-none text-[16px] lg:text-[20px] leading-[20px] lg:leading-[25px] font-light text-[#00459D] bg-[#F2F5FA] cursor-pointer transition-colors md:hover:bg-[#00459D] md:hover:text-white active:bg-[#003982] active:text-white";

export function HowToStartSection() {
  const { setLoginModalOpen, handleDownloadClick } = useApp();

  return (
    <section>
      <div className={containerClass}>
        <div className="flex flex-col lg:flex-row items-start justify-between gap-[40px] lg:gap-2 w-full">
          <div>
            <h2 className="md-[24px] lg:md-[48px] text-center lg:text-left">Как начать работу</h2>
            <ol className="flex flex-col gap-[32px] lg:gap-[48px]">
              {STEPS.map((step, idx) => (
                <li key={idx} className="flex flex-col gap-[12px] lg:gap-[16px]">
                  <p className="m-0 text-center lg:text-left text-[20px] lg:text-[24px] leading-[25px] lg:leading-[30px] font-bold text-[#1A1A1A]">{step.text}</p>
                  {step.btn && (
                    step.needLogin ? (
                      <button type="button" className={startBtnClass} onClick={() => setLoginModalOpen(true)}>{step.btn}</button>
                    ) : step.needDownload ? (
                      <button type="button" className={startBtnClass} onClick={handleDownloadClick}>{step.btn}</button>
                    ) : (
                      <Link to={step.link || "/"} className={startBtnClass}>{step.btn}</Link>
                    )
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="max-w-[373px] flex flex-col items-center">
            <p className="mb-[16px] lg:mb-[24px] text-[20px] leading-[25px] text-center text-[#1A1A1A]">Если у вас есть вопросы или нужна помощь — пишите нам 👇</p>
            <div className="flex items-center justify-center w-full h-[auto] mb-[24px]">
              <img src={qrImageMob} alt="QR код Telegram" className="w-full max-w-[250px] h-auto object-cover md:hidden" />
              <img src={qrImage} alt="QR код Telegram" className="w-full max-w-[250px] lg:max-w-[309px] h-auto object-cover hidden md:block" />
            </div>
            <div className="flex flex-col items-center gap-[16px] text-center">
              <div className="flex flex-col items-center">
                <a href="https://t.me/tacticode" className="text-[20px] leading-[25px] font-light text-[#8D8D8D] hover:underline" target="_blank" rel="noopener noreferrer">https://t.me/tacticode</a>
                <a href="https://t.me/tacticode" className="text-[20px] leading-[25px] font-light text-[#00459D] transition-colors hover:text-primary-dark hover:underline" target="_blank" rel="noopener noreferrer">@tacticode</a>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[20px] leading-[25px] font-light text-[#8D8D8D]">Email</span>
                <a href="mailto:support@tacticode.pro" className="text-[20px] leading-[25px] font-light text-[#00459D] transition-colors hover:text-primary-dark hover:underline">support@tacticode.pro</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
