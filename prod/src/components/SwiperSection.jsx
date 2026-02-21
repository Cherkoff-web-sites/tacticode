import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const containerClass = "w-full max-w-[1868px] p-0 lg:px-[24px] mx-auto";

export function SwiperSection({ title, linkTo, items, slidesPerView = 4, paginationId, renderSlide }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  return (
    <section>
      <div className={containerClass}>
        <div className="flex items-end justify-center lg:justify-start gap-[24px] mb-[16px] lg:mb-[32px]">
          <h2 className="mb-0 text-center md:text-right">{title}</h2>
          <Link to={linkTo} className="hidden md:block p-0 border-none text-[20px] leading-[25px] font-light text-[#00459D] bg-transparent cursor-pointer hover:underline">Смотреть все</Link>
        </div>
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={8}
            slidesPerView={1}
            slidesPerGroup={1}
            className="swiper-equal-height px-[24px] lg:px-0"
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            pagination={{
              clickable: true,
              el: `.${paginationId}`,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active"
            }}
            breakpoints={{ 768: { slidesPerView, slidesPerGroup: 1, spaceBetween: 24 } }}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                {renderSlide(item)}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Управление */}
          <div className="flex items-center justify-center gap-[16px] mt-[16px] lg:mt-[32px]">
            <button ref={prevRef} className="flex items-center justify-center p-[6px] lg:p-[8px] rounded-full bg-[#F2F5FA] text-[#00459D] cursor-pointer transition-all md:hover:bg-[#00459D] md:hover:text-white md:active:bg-[#003982] md:active:text-white disabled:opacity-80">
              <svg className="w-[20px] lg:w-[24px] h-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.49994 12.0001C7.49983 11.9015 7.5192 11.804 7.55691 11.713C7.59463 11.622 7.64994 11.5394 7.71971 11.4698L15.2197 3.96979C15.5127 3.67674 15.9873 3.67674 16.2802 3.96979C16.5731 4.26286 16.5733 4.73742 16.2802 5.0303L9.31046 12.0001L16.2802 18.9698C16.5733 19.2629 16.5733 19.7374 16.2802 20.0303C15.9871 20.3232 15.5126 20.3234 15.2197 20.0303L7.71971 12.5303C7.64994 12.4607 7.59463 12.3781 7.55691 12.2871C7.5192 12.1961 7.49983 12.0986 7.49994 12.0001Z" fill="currentColor"/>
              </svg>
            </button>
            <div className={`${paginationId} !top-auto !bottom-auto inline-flex gap-[8px] !w-auto`} />
            <button ref={nextRef} className="flex items-center justify-center p-[6px] lg:p-[8px] rounded-full bg-[#F2F5FA] text-[#00459D] cursor-pointer transition-all md:hover:bg-[#00459D] md:hover:text-white md:active:bg-[#003982] md:active:text-white disabled:opacity-80">
              <svg className="w-[20px] lg:w-[24px] h-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5001 11.9999C16.5002 12.0985 16.4808 12.196 16.4431 12.287C16.4054 12.378 16.3501 12.4606 16.2803 12.5302L8.78029 20.0302C8.48726 20.3233 8.01269 20.3233 7.71977 20.0302C7.42691 19.7371 7.42674 19.2626 7.71977 18.9697L14.6895 11.9999L7.71977 5.03023C7.42674 4.73714 7.42674 4.26257 7.71977 3.96972C8.01286 3.6768 8.48743 3.67663 8.78029 3.96972L16.2803 11.4697C16.3501 11.5393 16.4054 11.6219 16.4431 11.7129C16.4808 11.8039 16.5002 11.9014 16.5001 11.9999Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        {/* моб версия Смотреть все */}
        <div className="flex md:hidden items-center justify-center mt-[24px]">
          <Link to={linkTo} className="p-0 border-none text-[16px] leading-[20px] font-light text-[#00459D] bg-transparent cursor-pointer hover:underline">Смотреть все</Link>
        </div>
      </div>
    </section>
  );
}
