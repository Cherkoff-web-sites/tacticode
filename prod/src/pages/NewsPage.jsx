import React from "react";
import { useApp } from "../context/AppContext";
import { newsItems } from "../data";
import qrImage from "../assets/images/qr.png";

export function NewsPage() {
  const { displayedNewsCount, setDisplayedNewsCount, setLoginModalOpen, handleDownloadClick } = useApp();

  const steps = [
    { text: "Зарегистрируйтесь в личном кабинете на сайте", btn: "Зарегистрироваться", onClick: () => setLoginModalOpen(true) },
    { text: "Оформите подписку — без неё доступ к приложению будет закрыт", btn: "Оформить подписку" },
    { text: "Скачайте приложение для вашего компьютера", btn: "Скачать приложение", onClick: handleDownloadClick },
    { text: "Установите его и войдите в аккаунт, используя данные из личного кабинета" }
  ];

  return (
    <div className="max-w-[1120px] mx-auto px-10 w-full">
      <section className="mt-10 mb-20">
        <h1 className="m-0 text-2xl font-bold mb-8">Новости</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {Array.from({ length: displayedNewsCount }).map((_, index) => {
            const newsItem = newsItems[index % newsItems.length];
            return (
              <article key={"news-" + index} className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(15,23,42,0.04)] flex flex-col">
                <div className="w-full h-[200px] overflow-hidden bg-gray-200">
                  <img src={newsItem.image} alt={newsItem.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="m-0 text-base font-semibold leading-[1.4] text-gray-900">{newsItem.title}</h3>
                  <p className="m-0 text-[13px] text-gray-500 leading-[1.5] flex-1">{newsItem.description}</p>
                  <div className="text-xs text-gray-400 mt-auto">{newsItem.date}</div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setDisplayedNewsCount((prev) => prev + 8)}
            className="px-5 py-3 rounded-full border-none bg-primary text-white text-sm font-medium cursor-pointer transition-colors hover:bg-primary-dark"
          >
            Загрузить еще
          </button>
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
            <p className="m-0 text-sm text-gray-900 text-center flex items-center gap-2 justify-center">Если у вас есть вопросы или нужна помощь — пишите нам</p>
            <div className="flex justify-center">
              <div className="w-[200px] h-[200px] bg-white flex items-center justify-center relative overflow-hidden">
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
