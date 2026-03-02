import React from "react";
import { Link } from "react-router-dom";
import { newsItems, subscriptionItems } from "../data";
import heroVideo from "../assets/video/hero.mp4";
import heroPoster from "../assets/images/hero-poster.svg";
import { HowToStartSection } from "../components/HowToStartSection";
import { NewsCard } from "../components/NewsCard";
import { SubscriptionCard } from "../components/SubscriptionCard";
import { SwiperSection } from "../components/SwiperSection";

export function HomePage() {
  const containerClass = "w-full max-w-[1868px] px-[24px] mx-auto";
  const heroAdvantagesClass = "flex-1 text-center text-[16px] lg:text-[1.25vw] leading-[1.25] font-light text-[#1A1A1A]";
  const heroAdvantagesDiscClass = "w-[5px] h-[5px] lg:w-[0.42vw] lg:h-[0.42vw] shrink-0 rounded-full bg-[#D9E3F1]";

  return (
    <>
      <section>
        <div className={containerClass}>
            <h1 className="max-w-[315px] lg:max-w-[70.3vw] py-[28vh] lg:py-[154px] mx-auto my-0 text-[22px] lg:text-[2.92vw] font-black leading-[1.2] text-center">
              <span className="text-[#00459D]">Мы сделали</span> сервис, который помогает тренерам <span className="text-[#00459D]">удобно</span> строить тактику, стратегию, готовиться к&nbsp;играм и&nbsp;тренировкам
            </h1>
        </div>
        <div className="md:w-full md:max-w-[1868px] md:px-[24px] md:mx-auto">
          <video
            className="w-full h-[160px] md:h-[800px] rounded-[16px] lg:rounded-[60px] border-2 lg:border-8 border-solid border-[#FFF] object-cover shadow-[0px_4px_25px_rgba(0,69,157,0.05)]"
            autoPlay
            loop
            muted
            playsInline
            poster={heroPoster}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </div>
        <div className={containerClass}>
          <div className="relative">
            <div className="flex flex-col items-end">
              <h2 className="w-full mt-[16px] mb-[40px] text-center text-[18px] leading-[23px] lg:hidden">Спорт разный — Tacticode один</h2>
              <div className="lg:absolute left-[77px] bottom-0 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-2 w-[100%] lg:max-w-[57.92vw] p-[24px] lg:px-[2.92vw] lg: py-[2.19vw] rounded-[16px] lg:rounded-[24px] bg-[#FFF] shadow-[0px_4px_25px_rgba(0,69,157,0.05)]">
                <div className={heroAdvantagesClass}>Российская разработка</div>
                <div className={heroAdvantagesDiscClass} aria-hidden />
                <div className={heroAdvantagesClass}>Понятный интерфейс</div>
                <div className={heroAdvantagesDiscClass} aria-hidden />
                <div className={heroAdvantagesClass}>Простая <br className="hidden md:block" /> оплата</div>
                <div className={heroAdvantagesDiscClass} aria-hidden />
                <div className={heroAdvantagesClass}>Быстрый вход в&nbsp;приложение</div>
              </div>
              <h2 className="hidden lg:block m-0 mt-[1.67vw] mr-[3.8vw] lg:text-[1.67vw]">Спорт разный — Tacticode один</h2>
            </div>
          </div>
        </div>
      </section>

      <SwiperSection
        title="Новости"
        linkTo="/news"
        items={newsItems.slice(0, 8)}
        slidesPerView={4}
        paginationId="news-swiper-pagination"
        renderSlide={(item) => <NewsCard item={item} />}
      />

      <SwiperSection
        title="Оформить подписку"
        linkTo="/subscription"
        items={subscriptionItems.slice(0, 6)}
        slidesPerView={3}
        paginationId="subscription-swiper-pagination"
        renderSlide={(item) => <SubscriptionCard item={item} />}
      />

      <HowToStartSection />
    </>
  );
}
