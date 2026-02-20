import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const containerClass = "w-full max-w-[1868px] px-[24px] mx-auto";

export function SwiperSection({ title, linkTo, items, slidesPerView = 4, paginationId, renderSlide }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section>
      <div className={containerClass}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="">{title}</h2>
          <Link to={linkTo} className="p-0 border-none bg-transparent text-sm text-primary cursor-pointer">Смотреть все</Link>
        </div>
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1.1}
            slidesPerGroup={1}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            pagination={{
              clickable: true,
              el: `.${paginationId}`,
              bulletClass: "swiper-pagination-bullet !w-2 !h-2 !bg-gray-200 !opacity-100",
              bulletActiveClass: "swiper-pagination-bullet-active !bg-primary !w-6 !rounded"
            }}
            breakpoints={{ 768: { slidesPerView, slidesPerGroup: slidesPerView } }}
            className="!pb-10"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                {renderSlide(item)}
              </SwiperSlide>
            ))}
          </Swiper>
          <button ref={prevRef} className="absolute top-1/2 left-0 z-[2] -translate-y-1/2 md:-left-5 hidden md:flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary text-lg text-primary bg-white cursor-pointer transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">←</button>
          <button ref={nextRef} className="absolute top-1/2 right-0 z-[2] -translate-y-1/2 md:-right-5 hidden md:flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary text-lg text-primary bg-white cursor-pointer transition-all hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">→</button>
          <div className={`${paginationId} flex justify-center gap-2 mt-4`} />
        </div>
      </div>
    </section>
  );
}
