import React from "react";
import { useApp } from "../context/AppContext";
import { newsItems } from "../data";
import { HowToStartSection } from "../components/HowToStartSection";
import { NewsCard } from "../components/NewsCard";

export function NewsPage() {
  const { displayedNewsCount, setDisplayedNewsCount } = useApp();
  const containerClass = "w-full max-w-[1868px] px-[24px] mx-auto";
  const totalNews = newsItems.length;
  const visibleCount = Math.min(displayedNewsCount, totalNews);
  const hasMore = displayedNewsCount < totalNews;

  return (
    <>
      <section>
        <div className={containerClass}>
          <h1 className="h2">Новости</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {newsItems.slice(0, visibleCount).map((newsItem) => (
              <NewsCard key={newsItem.id} item={newsItem} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setDisplayedNewsCount((prev) => Math.min(prev + 8, totalNews))}
                className="w-full lg:w-auto p-[12px] lg:px-[40px] lg:py-[16px] rounded-full border-none mt-[32px] text-[16px] lg:text-[20px] leading-[20px] lg:leading-[25px] font-light text-white bg-primary cursor-pointer transition-colors hover:bg-primary-dark"
              >
                Загрузить еще
              </button>
            </div>
          )}
        </div>
      </section>

      <HowToStartSection />
    </>
  );
}
