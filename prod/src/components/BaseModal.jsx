import React from "react";

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  panelClassName = "",
  backdropClassName = "",
  showHeader = true,
  showClose = true,
  headerClassName = "",
  titleClassName = ""
}) {
  if (!isOpen) {
    return null;
  }

  const backdropBaseClass = "fixed inset-0 bg-[rgba(15,23,42,0.35)] flex items-center justify-center z-20";
  const panelBaseClass =
    "relative w-[min(640px,calc(100%-32px))] bg-white rounded-3xl p-[24px_32px_28px] shadow-[0_20px_60px_rgba(15,23,42,0.25)] max-md:p-5";
  const headerBaseClass = "flex justify-between items-center mb-4";
  const titleBaseClass = "text-lg font-semibold";
  const closeClass = "absolute top-0 right-0 cursor-pointer";

  return (
    <div className={`${backdropBaseClass}${backdropClassName ? " " + backdropClassName : ""}`} onClick={onClose}>
      <div className={`${panelBaseClass}${panelClassName ? " " + panelClassName : ""}`} onClick={(e) => e.stopPropagation()}>
        {showClose && (
          <button type="button" className={closeClass} onClick={onClose} aria-label="Закрыть">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="56" height="56" rx="28" fill="white"/>
              <rect x="17" y="18" width="2" height="28" rx="1" transform="rotate(-45 17 18)" fill="#00459D"/>
              <rect x="18" y="38" width="2" height="28" rx="1" transform="rotate(-135 18 38)" fill="#00459D"/>
            </svg>
          </button>
        )}
        {showHeader && (
          <div className={`${headerBaseClass}${headerClassName ? " " + headerClassName : ""}`}>
            <div className={`${titleBaseClass}${titleClassName ? " " + titleClassName : ""}`}>{title}</div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
