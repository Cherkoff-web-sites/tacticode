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

  const backdropBaseClass = `fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-20${long ? " max-md:items-end" : ""}`;
  const closeClass = "group absolute bottom-[calc(100%+16px)] lg:bottom-auto right-[24px] lg:right-auto lg:top-0 lg:left-[calc(100%+24px)] cursor-pointer rounded-full bg-white transition-colors md:hover:bg-[#00459D] active:bg-[#003982]";
  const panelBaseClass = `relative w-full max-w-[490px] p-[24px] lg:p-[32px] rounded-[20px] bg-[#FFF]${long ? " flex flex-col max-md:h-[calc(100%-80px)] max-md:rounded-[16px_16px_0_0] !pb-0 lg:!pb-0 md:max-h-[min(725px,90vh)]" : ""}`;
  const titleBaseClass = "mb-[8px] text-[20px] md:text-[24px] leading-[1.25] text-center font-bold";

  return (
    <div className={`${backdropBaseClass}${backdropClassName ? " " + backdropClassName : ""}`} onClick={onClose}>
      <div className={`${panelBaseClass}${panelClassName ? " " + panelClassName : ""}`} onClick={(e) => e.stopPropagation()}>
        {showClose && (
          <button type="button" className={closeClass} onClick={onClose} aria-label="Закрыть">
            <svg className="w-[40px] lg:w-[56px] h-auto text-[#00459D] transition-colors md:group-hover:text-white group-active:text-white" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="56" height="56" rx="28" fill="none"/>
              <rect x="17" y="18" width="2" height="28" rx="1" transform="rotate(-45 17 18)" fill="currentColor"/>
              <rect x="18" y="38" width="2" height="28" rx="1" transform="rotate(-135 18 38)" fill="currentColor"/>
            </svg>
          </button>
        )}
        <h3 className={`${titleBaseClass}${titleClassName ? " " + titleClassName : ""}`}>{title}</h3>
        {children}
      </div>
    </div>
  );
}
