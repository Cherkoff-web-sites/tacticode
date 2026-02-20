import React from "react";
import { useApp } from "../context/AppContext";
import { newsItems } from "../data";
import { HowToStartSection } from "../components/HowToStartSection";
import { NewsCard } from "../components/NewsCard";

export function NewsPage() {
  const { displayedNewsCount, setDisplayedNewsCount } = useApp();

  return (
    <div className="max-w-[1120px] mx-auto px-10 w-full">
      <section className="mt-10 mb-20">
        <h1 className="m-0 text-2xl font-bold mb-8">Новости</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {Array.from({ length: displayedNewsCount }).map((_, index) => {
            const newsItem = newsItems[index % newsItems.length];
            return <NewsCard key={"news-" + index} item={newsItem} />;
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

      <HowToStartSection />
    </div>
  );
}
