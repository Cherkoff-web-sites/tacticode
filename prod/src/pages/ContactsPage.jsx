import React from "react";
import qrImage from "../assets/images/qr.png";

export function ContactsPage() {
  return (
    <div className="max-w-[1120px] mx-auto px-10 w-full">
      <section className="mt-10 mb-20">
        <h1 className="m-0 text-2xl font-bold mb-8 max-md:text-center">Контакты</h1>
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
          <div className="flex flex-col items-center gap-6 max-md:order-1">
            <p className="m-0 text-sm text-gray-900 text-center flex items-center gap-2 justify-center">
              Если у вас есть вопросы или нужна помощь — пишите нам <span className="text-base">👇</span>
            </p>
            <div className="flex justify-center">
              <div className="w-[200px] h-[200px] rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center relative shadow-[0_4px_12px_rgba(15,23,42,0.08)] overflow-hidden">
                <img src={qrImage} alt="QR код Telegram" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
