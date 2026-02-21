import React, { useState } from "react";
import { subscriptionItems } from "../data";
import { HowToStartSection } from "../components/HowToStartSection";
import { SubscriptionCard } from "../components/SubscriptionCard";

export function SubscriptionPage() {
  const [displayedCount, setDisplayedCount] = useState(8);
  const totalSubscriptions = subscriptionItems.length;
  const visibleCount = Math.min(displayedCount, totalSubscriptions);
  const hasMore = displayedCount < totalSubscriptions;
  const containerClass = "w-full max-w-[1868px] px-[24px] mx-auto";

  return (
    <>
      <section>
        <div className={containerClass}>
          <h1 className="h2">Оформить подписку</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {subscriptionItems.slice(0, visibleCount).map((item) => (
            <SubscriptionCard key={item.id} item={item} />
          ))}
          </div>
          {hasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setDisplayedCount((prev) => Math.min(prev + 8, totalSubscriptions))}
                className="w-full lg:w-auto p-[12px] lg:px-[40px] lg:py-[16px] rounded-full border-none mt-[32px] text-[16px] lg:text-[20px] leading-[20px] lg:leading-[25px] font-light text-white bg-[#00459D] cursor-pointer transition-colors md:hover:bg-[#F2F5FA] md:hover:text-[#00459D] active:bg-[#D9E3F1] active:text-[#00459D]"
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
