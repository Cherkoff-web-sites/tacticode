import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import lockIcon from "../assets/icons/lockikon.svg";

const paymentButtonClass =
  "w-full md:w-auto md:self-start flex justify-center md:justify-start px-[40px] py-[12px] md:px-[min(2.08vw,40px)] md:py-[min(0.63vw,12px)] lg:py-[min(0.83vw,16px)] rounded-full border-none text-[16px] md:text-[min(0.83vw,16px)] lg:text-[min(1.04vw,20px)] leading-[20px] md:leading-[min(1.04vw,20px)] lg:leading-[min(1.3vw,25px)] font-light text-[#00459D] bg-[#F2F5FA] cursor-pointer transition-colors md:hover:bg-[#00459D] md:hover:text-white active:bg-[#003982] active:text-white";

export function SubscriptionCard({ item, className }) {
  const { period, setPeriod, setSubscriptions } = useApp();
  const cardRef = useRef(null);
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const [showUnlockedMessage, setShowUnlockedMessage] = useState(false);
  const isLocked = !!item.locked;

  const handleClick = () => {
    if (isLocked) {
      setShowLockedMessage(true);
      return;
    }
    setShowUnlockedMessage(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  useEffect(() => {
    if (!showLockedMessage && !showUnlockedMessage) return undefined;

    const handleOutside = (event) => {
      if (!cardRef.current) return;
      if (!cardRef.current.contains(event.target)) {
        setShowLockedMessage(false);
        setShowUnlockedMessage(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [showLockedMessage, showUnlockedMessage]);

  return (
    <div
      className={`relative w-full aspect-[312/413] lg:aspect-[590/450] rounded-[20px] overflow-hidden transition-shadow duration-200 hover:shadow-[0px_4px_25px_rgba(0,69,157,0.05)] cursor-default ${className ?? ""}`}
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        if (isLocked) {
          setShowLockedMessage(true);
        } else {
          setShowUnlockedMessage(true);
        }
      }}
      onMouseLeave={() => {
        if (isLocked) {
          setShowLockedMessage(false);
        } else {
          setShowUnlockedMessage(false);
        }
      }}
    >
      <img
        src={item.image}
        alt={`Подписка ${item.name ?? item.id}`}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          showUnlockedMessage ? "opacity-0" : "opacity-100"
        }`}
      />
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
      {!isLocked && (
        <div
          className={`absolute inset-0 flex flex-col w-full h-full p-[24px] lg:p-[min(1.67vw,32px)] bg-white transition-opacity duration-200 ${
            showUnlockedMessage ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <h3 className="md:mb-[min(0.83vw,16px)] text-[20px] md:text-[min(1.04vw,20px)] md:text-left text-center font-bold">
            {item.name ?? "Подписка"}
          </h3>
          <p className="mb-[8px] text-[16px] md:text-[min(1.04vw,20px)] leading-[1.25] font-light text-center md:text-left text-[#8D8D8D]">
            Выберите длительность подписки
          </p>
          <div className="flex flex-col gap-[20px] md:gap-[min(1.35vw,26px)] lg:gap-[min(1.35vw,26px)] h-full">
            <div className="inline-flex justify-between gap-[48px] lg:gap-[min(2.5vw,48px)] w-full md:w-auto md:self-start p-[8px] md:px-[min(1.04vw,20px)] md:py-[min(0.63vw,12px)] lg:px-[min(1.04vw,20px)] lg:py-[min(0.63vw,12px)] rounded-full bg-[#F8F8F8]">
              <button
                type="button"
                className={`px-[16px] md:px-[min(1.04vw,20px)] py-[8px] md:py-[min(0.63vw,12px)] lg:px-[min(1.04vw,20px)] lg:py-[min(0.63vw,12px)] rounded-full border-none text-[16px] md:text-[min(1.04vw,20px)] lg:text-[min(1.04vw,20px)] leading-[1.25] font-light cursor-pointer ${
                  period === "year" ? "bg-[#D9E3F1]" : "bg-transparent"
                }`}
                onClick={() => setPeriod("year")}
              >
                На год
              </button>
              <button
                type="button"
                className={`px-[16px] md:px-[min(1.04vw,20px)] py-[8px] md:py-[min(0.63vw,12px)] lg:px-[min(1.04vw,20px)] lg:py-[min(0.63vw,12px)] rounded-full border-none text-[16px] md:text-[min(1.04vw,20px)] lg:text-[min(1.04vw,20px)] leading-[1.25] font-light cursor-pointer ${
                  period === "month" ? "bg-[#D9E3F1]" : "bg-transparent"
                }`}
                onClick={() => setPeriod("month")}
              >
                На месяц
              </button>
            </div>

            <div className="flex max-md:justify-center md:min-h-[min(5vw,96px)] h-full">
              {period === "year" ? (
                <div className="flex flex-1 flex-col items-center md:items-start justify-center gap-[8px] md:gap-[min(0.83vw,16px)] max-md:max-w-[242px]">
                  <div className="flex items-baseline max-md:justify-center gap-[16px] md:gap-[min(0.83vw,16px)] flex-wrap">
                    <p className="h2 m-0 lg:text-[min(1.67vw,32px)] text-[#00459D]">3990&nbsp;р/год</p>
                    <p className="text-[16px] md:text-[min(1.04vw,20px)] leading-[1.25] font-light text-[#8D8D8D] line-through">
                      5980&nbsp;р/год
                    </p>
                  </div>

                  <div className="flex items-baseline max-md:justify-center gap-[16px] md:gap-[min(0.83vw,16px)] flex-wrap">
                    <p className="h2 m-0 lg:text-[min(1.67vw,32px)] text-[#00459D]">322&nbsp;р/месяц</p>
                    <p className="text-[16px] md:text-[min(1.04vw,20px)] leading-[1.25] font-light text-[#8D8D8D] line-through">
                      490&nbsp;р/месяц
                    </p>
                    <p className="text-[16px] md:text-[min(1.04vw,20px)] leading-[1.25] font-bold md:font-light text-[#1A1A1A]">
                      Выгода 32%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center md:items-start justify-center gap-[8px] md:gap-[min(0.83vw,16px)] max-md:max-w-[242px]">
                  <p className="h2 m-0 lg:text-[min(1.67vw,32px)] text-[#00459D]">490&nbsp;р/месяц</p>
                </div>
              )}
            </div>

            <div>
              <p className="mb-[8px] text-[16px] md:text-[min(1.04vw,20px)] leading-[1.25] font-light text-center md:text-left text-[#8D8D8D]">
                Выберите способ оплаты
              </p>
              <div className="flex max-md:flex-col gap-[8px] md:gap-[min(1.25vw,24px)]">
                <button
                  type="button"
                  className={paymentButtonClass}
                  onClick={() => {
                    setSubscriptions((prev) =>
                      prev.map((s) => (s.id === item.id ? { ...s, status: s.purchasedStatus } : s))
                    );
                    setShowUnlockedMessage(false);
                  }}
                >
                  Банковской картой
                </button>
                <button
                  type="button"
                  className={paymentButtonClass}
                  onClick={() => {
                    setSubscriptions((prev) =>
                      prev.map((s) => (s.id === item.id ? { ...s, status: s.purchasedStatus } : s))
                    );
                    setShowUnlockedMessage(false);
                  }}
                >
                  По QR-коду (СБП)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}