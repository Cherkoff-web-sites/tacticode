import React from "react";

export function NewsCard({ item, className }) {
  return (
    <article className={`flex flex-col h-full overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(15,23,42,0.04)] ${className ?? ""}`}>
      <div className="w-full h-[200px] overflow-hidden bg-gray-200">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col flex-1 gap-2 p-4 text-center md:text-left">
        <h3 className="m-0 text-base font-semibold leading-[1.4] text-gray-900">{item.title}</h3>
        <p className="flex-1 m-0 text-[13px] leading-[1.5] text-gray-500">{item.description}</p>
        <div className="mt-auto text-xs text-gray-400">{item.date}</div>
      </div>
    </article>
  );
}
