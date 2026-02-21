import React from "react";
import qrImage from "../assets/images/qr.png";
import qrImageMob from "../assets/images/qr_mob.png";

export function ContactsPage() {
  const containerClass = "w-full max-w-[1868px] px-[24px] mx-auto";

  return (
    <section>
      <div className={containerClass}>
          <h1 className="h2 text-center md:text-left">Контакты</h1>



          <div className="flex flex-col md:flex-row md:justify-between gap-[40px]">


            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p className="max-w-[563px] mb-[40px] lg:mb-[134px] text-[20px] lg:text-[24px] leading-[25px] lg:leading-[30px] font-light text-[#1A1A1A]">
                ⚡ Мы работаем онлайн, поэтому быстрее всего связаться с нами через почту или Telegram
              </p>
              <div className="mb-[40px] lg:mb-[48px]">
                <p className="mb-[4px] lg:mb-[0px] text-[20px] lg:text-[24px] leading-[25px] lg:leading-[30px] font-light text[#8D8D8D]">Telegram</p>
                <a href="https://t.me/tacticode" className="block text-[30px] md:text-[56px] leading-[35px] md:leading-[66px] font-black text-primary no-underline transition-colors md:hover:text-[#003982] active:text[#003982]" target="_blank" rel="noopener noreferrer">
                  @tacticode
                </a>
              </div>
              <div>
                <p className="mb-[4px] lg:mb-[0px] text-[20px] lg:text-[24px] leading-[25px] lg:leading-[30px] font-light text[#8D8D8D]">Email</p>
                <a href="mailto:support@tacticode.pro" className="block text-[30px] md:text-[56px] leading-[35px] md:leading-[66px] font-black text-primary no-underline transition-colors md:hover:text-[#003982] active:text[#003982]" target="_blank">
                  support@tacticode.pro
                </a>
              </div>
            </div>

            <div className="max-w-[373px] flex flex-col items-center">
              <p className="mb-[16px] lg:mb-[24px] text-[20px] lg:text-[24px] leading-[25px] lg:leading-[30px] text-center font-light text-[#1A1A1A]">
                Если у вас есть вопросы или нужна помощь — пишите нам 👇
              </p>
              <div className="flex items-center justify-center w-full h-[auto]">
                <img src={qrImageMob} alt="QR код Telegram" className="w-full max-w-[250px] h-auto object-cover md:hidden" />
                <img src={qrImage} alt="QR код Telegram" className="w-full max-w-[250px] lg:max-w-[309px] h-auto object-cover hidden md:block" />
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
