import React from "react";

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  panelClassName = "",
  backdropClassName = "",
  showClose = true,
  long = false,
  titleClassName = ""
}) {
  if (!isOpen) {
    return null;
  }

  const backdropBaseClass = `fixed inset-0 bg-[rgba(26,26,26,0.5)] flex items-center justify-center z-20${long ? " max-md:items-end" : ""}`;
  const closeClass = "absolute bottom-[calc(100%+16px)] lg:bottom-auto right-[24px] lg:right-auto lg:top-0 lg:left-[calc(100%+24px)] cursor-pointer";
  const panelBaseClass = `relative w-full max-w-[489px] p-[24px] lg:p-[32px] rounded-[16px] xl:rounded-[20px] bg-[#FFF]${long ? " max-md:h-[calc(100%-80px)] max-md:rounded-[16px_16px_0_0] pb-0 lg:pb-0 md:max-h-[min(725px,90vh)]" : ""}`;
  
  const titleBaseClass = "text-lg text-center font-semibold mb-4";

  return (
    <div className={`${backdropBaseClass}${backdropClassName ? " " + backdropClassName : ""}`} onClick={onClose}>
      <div className={`${panelBaseClass}${panelClassName ? " " + panelClassName : ""}`} onClick={(e) => e.stopPropagation()}>
        {showClose && (
          <button type="button" className={closeClass} onClick={onClose} aria-label="Закрыть">
            <svg className="w-[40px] lg:w-[56px] h-auto" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="56" height="56" rx="28" fill="white"/>
              <rect x="17" y="18" width="2" height="28" rx="1" transform="rotate(-45 17 18)" fill="#00459D"/>
              <rect x="18" y="38" width="2" height="28" rx="1" transform="rotate(-135 18 38)" fill="#00459D"/>
            </svg>
          </button>
        )}
        <h3 className={`${titleBaseClass}${titleClassName ? " " + titleClassName : ""}`}>{title}</h3>
        {children}
      </div>
    </div>
  );
}
