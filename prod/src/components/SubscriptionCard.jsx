import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import lockIcon from "../assets/icons/lockikon.svg";

export function SubscriptionCard({ item, className }) {
  const { setActiveModal } = useApp();
  const cardRef = useRef(null);
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const isLocked = !!item.locked;

  const handleClick = () => {
    if (isLocked) {
      setShowLockedMessage(true);
      return;
    }
    setActiveModal({ id: item.id });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  useEffect(() => {
    if (!showLockedMessage) return undefined;

    const handleOutside = (event) => {
      if (!cardRef.current) return;
      if (!cardRef.current.contains(event.target)) {
        setShowLockedMessage(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [showLockedMessage]);

  return (
    <div
      className={`relative w-full aspect-[312/413] lg:aspect-[590/450] rounded-[20px] overflow-hidden ${className ?? ""}`}
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => isLocked && setShowLockedMessage(true)}
      onMouseLeave={() => isLocked && setShowLockedMessage(false)}
    >
      <img src={item.image} alt={`Подписка ${item.id}`} className="w-full h-full object-cover" />
      {isLocked && (
        <img
          src={lockIcon}
          alt=""
          className="absolute top-[16px] lg:top-[32px] right-[16px] lg:right-[32px] w-[24px] lg:w-[48px] h-[24px] lg:h-[48px]"
          aria-hidden="true"
        />
      )}
      {isLocked && (
        <div
          className={`absolute top-0 right-0 bottom-0 left-0 lg:top-auto flex flex-col items-center lg:items-start justify-end w-full aspect-[312/413] lg:aspect-[590/379] p-[24px] text-center lg:text-left text-[#FFF] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,#000000_100%)] rounded-b-[20px] transition-opacity duration-200 ${showLockedMessage ? "opacity-100" : "opacity-0"}`}
        >
          <h3 className="mb-[16px] text-[20px] leading-[25px] lg:text-[24px] lg:leading-[30px] font-bold">Выбранный раздел недоступен</h3>
          <p className="m-0 text-[16px] leading-[20px] lg:text-[20px] lg:leading-[25px] font-light">
            К&nbsp;сожалению, данный вид спорта еще находится в&nbsp;разработке, но&nbsp;мы&nbsp;обязательно сообщим, когда он&nbsp;станет доступен. Следите за&nbsp;новостями на&nbsp;сайте.
          </p>
        </div>
      )}
    </div>
  );
}