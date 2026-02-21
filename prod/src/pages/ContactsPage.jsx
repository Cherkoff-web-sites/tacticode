import React from "react";
import qrImage from "../assets/images/qr.png";
import qrImageMob from "../assets/images/qr_mob.png";

export function ContactsPage() {
  const containerClass = "w-full max-w-[1868px] px-[24px] mx-auto";

  return (
    <section>
      <div className={containerClass}>
          <h1 className="h2 text-center md:text-left">Контакты</h1>
          <div className="grid grid-cols-2 gap-20 items-start max-md:grid-cols-1 max-md:gap-10">
          <div className="max-md:order-2">
            <p className="m-0 text-sm text-gray-600 mb-8 flex items-center gap-2">
              <span className="text-base">⚡</span>
              Мы работаем онлайн, поэтому быстрее всего связаться с нами через почту или Telegram
            </p>
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">Telegram</div>
              <a href="https://t.me/tacticode" className="text-2xl font-bold text-primary no-underline transition-colors hover:text-primary-dark block" target="_blank" rel="noopener noreferrer">
                @tacticode
              </a>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Email</div>
              <a href="mailto:support@tacticode.pro" className="text-2xl font-bold text-primary no-underline transition-colors hover:text-primary-dark block">
                support@tacticode.pro
              </a>
            </div>
          </div>
          <div className="max-w-[373px] flex flex-col items-center max-md:order-1">
            <p className="mb-[16px] lg:mb-[24px] text-[20px] leading-[25px] text-center text-[#1A1A1A]">
              Если у вас есть вопросы или нужна помощь — пишите нам 👇
            </p>
            <div className="flex items-center justify-center w-full h-[auto] mb-[24px]">
              <img src={qrImageMob} alt="QR код Telegram" className="w-full max-w-[250px] h-auto object-cover md:hidden" />
              <img src={qrImage} alt="QR код Telegram" className="w-full max-w-[250px] lg:max-w-[309px] h-auto object-cover hidden md:block" />
            </div>
          </div>
          </div>
      </div>
    </section>
  );
}
