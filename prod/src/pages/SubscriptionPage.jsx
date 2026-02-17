import React from "react";
import { useApp } from "../context/AppContext";
import { subscriptionItems } from "../data";
import qrImage from "../assets/images/qr.png";

export function SubscriptionPage() {
  const { setLoginModalOpen, handleDownloadClick } = useApp();

  const steps = [
    { text: "Зарегистрируйтесь в личном кабинете на сайте", btn: "Зарегистрироваться", onClick: () => setLoginModalOpen(true) },
    { text: "Оформите подписку — без неё доступ к приложению будет закрыт", btn: "Оформить подписку" },
    { text: "Скачайте приложение для вашего компьютера", btn: "Скачать приложение", onClick: handleDownloadClick },
    { text: "Установите его и войдите в аккаунт, используя данные из личного кабинета" }
  ];

  return (
    <div className="max-w-[1120px] mx-auto px-10 w-full">
      <section className="mt-10 mb-20">
        <h1 className="m-0 text-2xl font-bold mb-8">Оформить подписку</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {subscriptionItems.map((item) => (
            <div key={item.id} className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
              <img src={item.image} alt={`Подписка ${item.id}`} className="w-full h-full object-cover" />
              {item.locked && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-black/70 rounded-lg flex items-center justify-center text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1120px] mx-auto mt-20">
        <div className="grid grid-cols-2 gap-20 items-start max-md:grid-cols-1 max-md:gap-10">
          <div className="max-md:order-2">
            <h2 className="">Как начать работу</h2>
            <ol className="list-none p-0 m-0 flex flex-col gap-6 [counter-reset:step-counter]">
              {steps.map((step, idx) => (
                <li key={idx} className="flex flex-col gap-3 relative pl-10 [counter-increment:step-counter] before:content-[counter(step-counter)] before:absolute before:left-0 before:top-0 before:w-7 before:h-7 before:rounded-full before:bg-primary before:text-white before:flex before:items-center before:justify-center before:text-sm before:font-semibold before:flex-shrink-0">
                  <p className="m-0 text-sm leading-[1.5] text-gray-900">{step.text}</p>
                  {step.btn && (
                    <button
                      type="button"
                      className="px-5 py-[10px] rounded-full border-none bg-[#eef2ff] text-gray-900 text-sm font-medium cursor-pointer self-start transition-colors hover:bg-[#e0e7ff]"
                      onClick={step.onClick}
                    >
                      {step.btn}
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col items-center gap-6 max-md:order-1">
            <p className="m-0 text-sm text-gray-900 text-center flex items-center gap-2 justify-center">Если у вас есть вопросы или нужна помощь — пишите нам <span className="text-base">✍️</span></p>
            <div className="flex justify-center">
              <div className="w-[200px] h-[200px] rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center relative shadow-[0_4px_12px_rgba(15,23,42,0.08)] overflow-hidden">
                <img src={qrImage} alt="QR код Telegram" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <a href="https://t.me/tacticode" className="text-sm text-primary no-underline transition-colors hover:text-primary-dark hover:underline" target="_blank" rel="noopener noreferrer">https://t.me/tacticode</a>
              <a href="https://t.me/tacticode" className="text-sm text-primary no-underline transition-colors hover:text-primary-dark hover:underline" target="_blank" rel="noopener noreferrer">@tacticode</a>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-sm text-gray-500">Email</span>
                <a href="mailto:support@tacticode.pro" className="text-sm text-primary no-underline transition-colors hover:text-primary-dark hover:underline">support@tacticode.pro</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
