import React from "react";
import { useApp } from "../context/AppContext";

export function NewsCard({ item, className }) {
  const { setNewsModalItem } = useApp();

  const handleClick = () => {
    setNewsModalItem(item);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setNewsModalItem(item);
    }
  };

  return (
    <article
      className={`group flex flex-col h-full overflow-hidden rounded-[16px] lg:rounded-[20px] bg-[#F8F8F8] cursor-pointer transition-colors transition-shadow duration-200 md:hover:bg-white active:bg-white md:hover:shadow-[0px_4px_25px_rgba(0,69,157,0.05)] active:shadow-[0px_4px_25px_rgba(0,69,157,0.05)] ${className ?? ""}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full aspect-[312/226] lg:aspect-[440/226] rounded-[16px] lg:rounded-[20px] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-200 md:group-hover:scale-[1.05] group-active:scale-[1.05]"
        />
      </div>
      <div className="flex flex-col flex-1 gap-[16px] p-[16px] lg:p-[24px] lg:pt-[16px] text-center md:text-left text-[16px] lg:text-[20px] leading-[20px] lg:leading-[25px] text-[#1A1A1A]">
        <h3 className="m-0 font-bold">{item.title}</h3>
        <p className="flex-1 m-0 font-light line-clamp-4">{item.description}</p>
        <div className="mt-auto font-light text-[#8D8D8D]">{item.date}</div>
      </div>
    </article>
  );
}
