import React from "react";
import { subscriptionItems } from "../data";
import { HowToStartSection } from "../components/HowToStartSection";
import { SubscriptionCard } from "../components/SubscriptionCard";

export function SubscriptionPage() {

  return (
    <div className="max-w-[1120px] mx-auto px-10 w-full">
      <section className="mt-10 mb-20">
        <h1 className="m-0 text-2xl font-bold mb-8">Оформить подписку</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {subscriptionItems.map((item) => (
            <SubscriptionCard key={item.id} item={item} variant="grid" />
          ))}
        </div>
      </section>

      <HowToStartSection />
    </div>
  );
}
