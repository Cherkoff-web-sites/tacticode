import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useApp } from "../context/AppContext";
import { newsItems, subscriptionItems } from "../data";
import heroVideo from "../assets/video/hero.mp4";
import heroPoster from "../assets/images/hero-poster.svg";
import qrImage from "../assets/images/qr.png";

const STEPS = [
  { text: "1. Зарегистрируйтесь в личном кабинете на сайте", btn: "Зарегистрироваться", needLogin: true },
  { text: "2. Оформите подписку — без неё доступ к приложению будет закрыт", btn: "Оформить подписку", link: "/subscription" },
  { text: "3. Скачайте приложение для вашего компьютера", btn: "Скачать приложение", needDownload: true },
  { text: "4. Установите его и войдите в аккаунт, используя данные из личного кабинета" }
];

export function HomePage() {
  const { setLoginModalOpen, handleDownloadClick } = useApp();
  const newsPrevRef = useRef(null);
  const newsNextRef = useRef(null);
  const subscriptionPrevRef = useRef(null);
  const subscriptionNextRef = useRef(null);

  return (
    <div className="max-w-[1820px] mx-auto px-[24px] lg:px-10 w-full">
      <section className="mt-0 lg:mt-10">
        <div className="text-center mb-8">
          <h1 className="m-0 text-[22px] lg:text-[32px] font-bold leading-[1.4] py-[28vh] lg:py-0">
            Мы <span className="text-[#1d4ed8]">сделали</span> сервис, который помогает тренерам{" "}
            <span className="text-[#1d4ed8]">удобно</span> строить тактику, стратегию, готовиться к играм и тренировкам
          </h1>
        </div>
        <div className="relative">
          <video
            className="w-full h-[160px] md:h-[760px] rounded-[32px] object-cover shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
            autoPlay
            loop
            muted
            playsInline
            poster={heroPoster}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="my-5 text-center font-bold lg:hidden">Спорт разный — Tacticode один</div>
          <div className="lg:absolute left-1/2 -bottom-10 lg:-translate-x-1/2 lg:w-[min(720px,90%)]">
            <div className="flex justify-between gap-3 px-6 py-4 bg-white rounded-[20px] shadow-[0_12px_30px_rgba(15,23,42,0.16)] flex-col lg:flex-row">
              <div className="flex-1 text-center text-[13px]"><div className="text-gray-500">Российская разработка</div></div>
              <div className="flex-1 text-center text-[13px]"><div className="text-gray-500">Понятный интерфейс</div></div>
              <div className="flex-1 text-center text-[13px]"><div className="text-gray-500">Простая оплата</div></div>
              <div className="flex-1 text-center text-[13px]"><div className="text-gray-500">Быстрый приложение</div></div>
            </div>
          </div>
          <div className="mt-18 mb-0 text-right font-bold hidden lg:block">Спорт разный — Tacticode один</div>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="">Новости</h2>
          <Link to="/news" className="border-none bg-transparent p-0 text-sm text-primary cursor-pointer">Смотреть все</Link>
        </div>
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1.1}
            slidesPerGroup={1}
            navigation={{ prevEl: newsPrevRef.current, nextEl: newsNextRef.current }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = newsPrevRef.current;
              swiper.params.navigation.nextEl = newsNextRef.current;
            }}
            pagination={{
              clickable: true,
              el: ".news-swiper-pagination",
              bulletClass: "swiper-pagination-bullet !w-2 !h-2 !bg-gray-200 !opacity-100",
              bulletActiveClass: "swiper-pagination-bullet-active !bg-primary !w-6 !rounded"
            }}
            breakpoints={{ 768: { slidesPerView: 4, slidesPerGroup: 4 } }}
            className="!pb-10"
          >
            {newsItems.map((item) => (
              <SwiperSlide key={item.id}>
                <article className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(15,23,42,0.04)] flex flex-col h-full">
                  <div className="w-full h-[200px] overflow-hidden bg-gray-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1 text-center md:text-left">
                    <h3 className="m-0 text-base font-semibold leading-[1.4] text-gray-900">{item.title}</h3>
                    <p className="m-0 text-[13px] text-gray-500 leading-[1.5] flex-1">{item.description}</p>
                    <div className="text-xs text-gray-400 mt-auto">{item.date}</div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
          <button ref={newsPrevRef} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-5 w-10 h-10 rounded-full border-2 border-primary bg-white text-primary text-lg cursor-pointer z-[2] hidden md:flex items-center justify-center transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">←</button>
          <button ref={newsNextRef} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-5 w-10 h-10 rounded-full border-2 border-primary bg-white text-primary text-lg cursor-pointer z-[2] hidden md:flex items-center justify-center transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">→</button>
          <div className="news-swiper-pagination flex justify-center gap-2 mt-4" />
        </div>
      </section>

      <section className="mt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="">Оформить подписку</h2>
          <Link to="/subscription" className="border-none bg-transparent p-0 text-sm text-primary cursor-pointer">Смотреть все</Link>
        </div>
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1.1}
            slidesPerGroup={1}
            navigation={{ prevEl: subscriptionPrevRef.current, nextEl: subscriptionNextRef.current }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = subscriptionPrevRef.current;
              swiper.params.navigation.nextEl = subscriptionNextRef.current;
            }}
            pagination={{
              clickable: true,
              el: ".subscription-swiper-pagination",
              bulletClass: "swiper-pagination-bullet !w-2 !h-2 !bg-gray-200 !opacity-100",
              bulletActiveClass: "swiper-pagination-bullet-active !bg-primary !w-6 !rounded"
            }}
            breakpoints={{ 768: { slidesPerView: 3, slidesPerGroup: 3 } }}
            className="!pb-10"
          >
            {subscriptionItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
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
              </SwiperSlide>
            ))}
          </Swiper>
          <button ref={subscriptionPrevRef} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-5 w-10 h-10 rounded-full border-2 border-primary bg-white text-primary text-lg cursor-pointer z-[2] hidden md:flex items-center justify-center transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">←</button>
          <button ref={subscriptionNextRef} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-5 w-10 h-10 rounded-full border-2 border-primary bg-white text-primary text-lg cursor-pointer z-[2] hidden md:flex items-center justify-center transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">→</button>
          <div className="subscription-swiper-pagination flex justify-center gap-2 mt-4" />
        </div>
      </section>

      <section className="max-w-[1120px] mx-auto mt-20">
        <div className="grid grid-cols-2 gap-20 items-start max-md:grid-cols-1 max-md:gap-10">
          <div className="max-md:order-2">
            <h2 className="">Как начать работу</h2>
            <ol className="list-decimal pl-5 m-0 flex flex-col gap-6">
              {STEPS.map((step, idx) => (
                <li key={idx} className="flex flex-col gap-3">
                  <p className="m-0 text-sm leading-[1.5] text-gray-900 font-semibold">{step.text}</p>
                  {step.btn && (
                    step.needLogin ? (
                      <button type="button" className="px-5 py-[10px] rounded-full border-none bg-[#eef2ff] text-gray-900 text-sm cursor-pointer self-start transition-colors hover:bg-[#e0e7ff]" onClick={() => setLoginModalOpen(true)}>{step.btn}</button>
                    ) : step.needDownload ? (
                      <button type="button" className="px-5 py-[10px] rounded-full border-none bg-[#eef2ff] text-gray-900 text-sm cursor-pointer self-start transition-colors hover:bg-[#e0e7ff]" onClick={handleDownloadClick}>{step.btn}</button>
                    ) : (
                      <Link to={step.link || "/"} className="px-5 py-[10px] rounded-full border-none bg-[#eef2ff] text-gray-900 text-sm font-medium cursor-pointer self-start transition-colors hover:bg-[#e0e7ff]">{step.btn}</Link>
                    )
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
