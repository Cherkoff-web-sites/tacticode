import React from "react";

export function NewsCard({ item, className }) {
  return (
    <article className={`flex flex-col h-full overflow-hidden rounded-[16px] lg:rounded-[20px] bg-[#F8F8F8] ${className ?? ""}`}>
      <div className="w-full aspect-[312/226] lg:aspect-[440/226] rounded-[16px] lg:rounded-[20px] overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col flex-1 gap-[16px] p-[16px] lg:p-[24px] lg:pt-[16px] text-center md:text-left text-[16px] lg:text-[20px] leading-[20px] lg:leading-[25px] text-[#1A1A1A]">
        <h3 className="m-0 font-bold">{item.title}</h3>
        <p className="flex-1 m-0 font-light line-clamp-4">{item.description}</p>
        <div className="mt-auto font-light text-[#8D8D8D]">{item.date}</div>
      </div>
    </article>
  );
}
