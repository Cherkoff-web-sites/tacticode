import React from "react";

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export function SubscriptionCard({ item, variant = "slider", className }) {
  const sizeClass = variant === "grid" ? "h-[300px]" : "aspect-[3/4]";
  return (
    <div className={`relative w-full ${sizeClass} overflow-hidden rounded-2xl shadow-[0_1px_4px_rgba(15,23,42,0.04)] ${className ?? ""}`}>
      <img src={item.image} alt={`Подписка ${item.id}`} className="w-full h-full object-cover" />
      {item.locked && (
        <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg bg-black/70 text-white">
          <LockIcon />
        </div>
      )}
    </div>
  );
}
