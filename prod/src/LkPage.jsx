import React, { useState, useEffect, useRef } from "react";
import { subscriptionItems } from "./data";
import { useApp } from "./context/AppContext";

function EditFieldSvg({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 shrink-0 ${active ? "text-[#00459D]" : "text-[#8D8D8D] lg:hover:text-[#00459D]"}`} aria-hidden="true">
      <path d="M12.6323 0.503917C12.3703 0.503917 12.1078 0.602417 11.9108 0.799917L10.7868 1.92392L14.0768 5.21292L15.1998 4.08892C15.3892 3.89644 15.4954 3.63721 15.4954 3.36717C15.4954 3.09712 15.3892 2.8379 15.1998 2.64542L13.3538 0.799917C13.2589 0.70549 13.1464 0.630732 13.0226 0.579935C12.8988 0.529138 12.7661 0.503304 12.6323 0.503917ZM10.0793 2.63092L1.94479 10.7659C1.89013 10.821 1.84875 10.8879 1.82379 10.9614C1.45929 12.0549 0.806287 13.8409 0.523787 14.8629C0.500824 14.9463 0.499905 15.0343 0.521119 15.1182C0.542334 15.2021 0.584955 15.279 0.644817 15.3415C0.704678 15.404 0.77973 15.4499 0.862633 15.4747C0.945537 15.4994 1.03345 15.5023 1.11779 15.4829C2.33379 15.2019 3.96129 14.5349 5.03779 14.1764C5.11114 14.1523 5.17813 14.1119 5.23379 14.0584L13.3683 5.92092L10.0793 2.63092Z" fill="currentColor"/>
    </svg>
  );
}

function ClearFieldSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" aria-hidden="true">
      <rect x="3.0498" y="14.8638" width="2" height="16" rx="1" transform="rotate(-135 3.0498 14.8638)" fill="#8D8D8D"/>
      <rect x="1.63574" y="3.55029" width="2" height="16" rx="1" transform="rotate(-45 1.63574 3.55029)" fill="#8D8D8D"/>
    </svg>
  );
}

function ConfirmFieldSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" aria-hidden="true">
      <path d="M15.6282 2.61531C15.1332 2.11961 14.3293 2.11992 13.8336 2.61531L5.75659 10.6926L2.1667 7.10279C1.671 6.60708 0.867479 6.60708 0.371777 7.10279C-0.123926 7.59849 -0.123926 8.40201 0.371777 8.89771L4.85894 13.3849C5.10663 13.6326 5.43143 13.7567 5.75625 13.7567C6.08107 13.7567 6.40617 13.6329 6.65387 13.3849L15.6282 4.41021C16.1239 3.91485 16.1239 3.11098 15.6282 2.61531Z" fill="#00459D"/>
    </svg>
  );
}

function EyeFieldSvg({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[#00459D]" : "text-[#8D8D8D] lg:group-hover:text-[#00459D]"}`} aria-hidden="true">
      <path d="M9 3.63525C5.56091 3.63525 2.44216 5.51681 0.140841 8.57296C-0.0469469 8.82335 -0.0469469 9.17315 0.140841 9.42353C2.44216 12.4834 5.56091 14.3649 9 14.3649C12.4391 14.3649 15.5578 12.4834 17.8592 9.42721C18.0469 9.17683 18.0469 8.82703 17.8592 8.57665C15.5578 5.51681 12.4391 3.63525 9 3.63525ZM9.2467 12.7779C6.96379 12.9215 5.07855 11.04 5.22215 8.75339C5.33998 6.86815 6.86806 5.34007 8.7533 5.22224C11.0362 5.07864 12.9214 6.9602 12.7778 9.24679C12.6563 11.1283 11.1283 12.6564 9.2467 12.7779ZM9.13256 11.0326C7.90273 11.1099 6.88647 10.0974 6.96747 8.86753C7.03007 7.85127 7.85486 7.03016 8.87113 6.96388C10.101 6.88656 11.1172 7.89914 11.0362 9.12896C10.9699 10.1489 10.1451 10.97 9.13256 11.0326Z" fill="currentColor"/>
    </svg>
  );
}

function DeviceTypeIcon({ deviceName }) {
  if (/POCO|iPhone|phone|Android/i.test(deviceName)) {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" aria-hidden="true">
        <path d="M26.322 3.62317H13.678C12.8009 3.62317 11.9598 3.97156 11.3397 4.5917C10.7195 5.21185 10.3711 6.05294 10.3711 6.92997V33.0701C10.3711 33.9471 10.7195 34.7882 11.3397 35.4084C11.9598 36.0285 12.8009 36.3769 13.678 36.3769H26.322C27.1991 36.3769 28.0402 36.0285 28.6603 35.4084C29.2805 34.7882 29.6289 33.9471 29.6289 33.0701V6.92997C29.6289 6.05294 29.2805 5.21185 28.6603 4.5917C28.0402 3.97156 27.1991 3.62317 26.322 3.62317ZM20.6422 33.3021H19.3578C19.0574 33.3021 18.7692 33.1827 18.5568 32.9703C18.3443 32.7578 18.225 32.4697 18.225 32.1693C18.225 31.8688 18.3443 31.5807 18.5568 31.3682C18.7692 31.1558 19.0574 31.0364 19.3578 31.0364H20.6422C20.9426 31.0364 21.2308 31.1558 21.4432 31.3682C21.6557 31.5807 21.775 31.8688 21.775 32.1693C21.775 32.4697 21.6557 32.7578 21.4432 32.9703C21.2308 33.1827 20.9426 33.3021 20.6422 33.3021ZM22.832 8.96379H17.168C16.8675 8.96379 16.5794 8.84444 16.3669 8.632C16.1545 8.41956 16.0352 8.13142 16.0352 7.83098C16.0352 7.53054 16.1545 7.2424 16.3669 7.02996C16.5794 6.81752 16.8675 6.69817 17.168 6.69817H22.832C23.1325 6.69817 23.4206 6.81752 23.6331 7.02996C23.8455 7.2424 23.9648 7.53054 23.9648 7.83098C23.9648 8.13142 23.8455 8.41956 23.6331 8.632C23.4206 8.84444 23.1325 8.96379 22.832 8.96379Z" fill="#D3D3D1"/>
      </svg>
    );
  }

  if (/MSI|Katana|Laptop|Notebook|Book/i.test(deviceName)) {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" aria-hidden="true">
        <path d="M32.0623 23.1519V9.04395C32.0623 8.77873 31.9569 8.52437 31.7694 8.33684C31.5818 8.1493 31.3275 8.04395 31.0623 8.04395H8.93827C8.67306 8.04395 8.4187 8.1493 8.23116 8.33684C8.04363 8.52437 7.93827 8.77873 7.93827 9.04395V23.1519H32.0623ZM34.9183 30.5599L32.5833 25.1529H7.41727L5.08227 30.5599C5.0164 30.712 4.98942 30.8781 5.00374 31.0433C5.01806 31.2084 5.07324 31.3674 5.1643 31.5058C5.25537 31.6443 5.37946 31.758 5.5254 31.8365C5.67133 31.9151 5.83453 31.9562 6.00027 31.9559H34.0003C34.166 31.9562 34.3292 31.9151 34.4751 31.8365C34.6211 31.758 34.7452 31.6443 34.8362 31.5058C34.9273 31.3674 34.9825 31.2084 34.9968 31.0433C35.0111 30.8781 34.9841 30.712 34.9183 30.5599Z" fill="#D3D3D1"/>
      </svg>
    );
  }

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0" aria-hidden="true">
      <path d="M30.3337 5.83337H9.66699C7.45785 5.83337 5.66699 7.62424 5.66699 9.83337V23.8334C5.66699 26.0425 7.45785 27.8334 9.66699 27.8334H30.3337C32.5428 27.8334 34.3337 26.0425 34.3337 23.8334V9.83337C34.3337 7.62424 32.5428 5.83337 30.3337 5.83337Z" fill="#D3D3D1"/>
      <path d="M24.0001 29.1667V32.1667C24.0225 32.4046 23.9515 32.6419 23.8023 32.8285C23.653 33.015 23.4371 33.1363 23.2001 33.1667H16.8001C16.5631 33.1363 16.3472 33.015 16.198 32.8285C16.0487 32.6419 15.9778 32.4046 16.0001 32.1667V29.1667H24.0001Z" fill="#D3D3D1"/>
      <path d="M26.6673 33.1667H13.334C13.0688 33.1667 12.8144 33.0614 12.6269 32.8739C12.4393 32.6863 12.334 32.432 12.334 32.1667C12.334 31.9015 12.4393 31.6472 12.6269 31.4596C12.8144 31.2721 13.0688 31.1667 13.334 31.1667H26.6673C26.9325 31.1667 27.1869 31.2721 27.3744 31.4596C27.562 31.6472 27.6673 31.9015 27.6673 32.1667C27.6673 32.432 27.562 32.6863 27.3744 32.8739C27.1869 33.0614 26.9325 33.1667 26.6673 33.1667Z" fill="#D3D3D1"/>
    </svg>
  );
}

function EditableField({
  label,
  value,
  editingValue = value,
  isEditing,
  onStartEdit,
  onConfirm,
  onClear,
  onExitWithoutSave,
  mainText,
  fieldValueClass,
  inputType = "text",
  secondaryControl = null,
}) {
  const [draft, setDraft] = useState(value);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const initialValueRef = useRef(value);
  const wasEditingRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      if (!wasEditingRef.current) {
        wasEditingRef.current = true;
        setDraft(editingValue);
        initialValueRef.current = editingValue;
      }
      inputRef.current?.focus();
    } else {
      wasEditingRef.current = false;
    }
  }, [editingValue, isEditing]);

  const hasChanges = isEditing && draft !== initialValueRef.current;

  useEffect(() => {
    if (!isEditing || hasChanges || !onExitWithoutSave) return;
    const handleMouseDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onExitWithoutSave();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isEditing, hasChanges, onExitWithoutSave]);

  const showActiveStyle = isEditing || hovered;
  const wrapperBgClass = showActiveStyle ? "!bg-[#F2F5FA]" : "";

  return (
    <div ref={wrapperRef} className="field-group">
      <label className={`${mainText} field-label`}>{label}</label>
      <div
        className={`${fieldValueClass} group gap-[16px] ${wrapperBgClass} cursor-default`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <input
          ref={inputRef}
          type={inputType}
          value={isEditing ? draft : value}
          onChange={(e) => setDraft(e.target.value)}
          readOnly={!isEditing}
          className={`w-full min-w-0 border-none outline-none bg-transparent p-0 text-[20px] leading-[1.25] font-light text-[#000] ${isEditing ? "cursor-text" : "cursor-default"}`}
        />
        {isEditing ? (
          hasChanges ? (
            <div className="flex items-center gap-[16px] shrink-0">
              {secondaryControl}
              <button type="button" className="border-none bg-transparent p-0 cursor-pointer" onClick={onClear} aria-label={`Отменить редактирование ${label}`}>
                <ClearFieldSvg />
              </button>
              <button type="button" className="border-none bg-transparent p-0 cursor-pointer" onClick={() => onConfirm(draft)} aria-label={`Сохранить поле ${label}`}>
                <ConfirmFieldSvg />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-[16px] shrink-0">
              {secondaryControl}
              <button type="button" className="border-none bg-transparent p-0 cursor-pointer shrink-0" onClick={onStartEdit} aria-label={`Редактировать поле ${label}`}>
                <EditFieldSvg active />
              </button>
            </div>
          )
        ) : (
          <div className="flex items-center gap-[16px] shrink-0">
            {secondaryControl}
            <button type="button" className="border-none bg-transparent p-0 cursor-pointer shrink-0" onClick={onStartEdit} aria-label={`Редактировать поле ${label}`}>
              <EditFieldSvg active={hovered} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LkPage() {
  const PASSWORD_PLACEHOLDER = "********";
  const containerClass = "w-full max-w-[1868px] px-[24px] mx-auto";
  const mainText = "text-[16px] md:text-[20px] leading-[1.25] font-light";
  const fieldValueClass = "flex items-center justify-between w-full rounded-full bg-[#F8F8F8] pl-[24px] pr-[24px] py-[16px] text-[20px] leading-[1.25] font-light text-[#000]";
  const [showAllSports, setShowAllSports] = useState(false);
  const [editableFields, setEditableFields] = useState({
    login: "",
    surname: "Константинопольский",
    firstName: "Константин",
    birthDate: "02.06.2000",
    club: "«Спартак»",
  });
  const [editingField, setEditingField] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    user,
    passwordPreview,
    subscriptions,
    devices,
    setHistoryModalOpen,
    setLogoutModalOpen,
    setActiveModal,
    setDeviceToRemove,
    updateProfile,
    changeMyPassword,
  } = useApp();
  const subscriptionMap = new Map(subscriptions.map((item) => [item.id, item]));
  const lkSubscriptions = subscriptionItems.map((item) => {
    const currentSubscription = subscriptionMap.get(item.id);

    return {
      ...item,
      ...currentSubscription,
      name: (currentSubscription?.name && currentSubscription.name.trim()) ? currentSubscription.name : item.name,
      status: currentSubscription?.status ?? "inactive",
      purchasedStatus: currentSubscription?.purchasedStatus ?? "active",
      since: currentSubscription?.since ?? "",
      until: currentSubscription?.until ?? "",
      details: currentSubscription?.details ?? "",
    };
  });

  const updateEditableField = (field, nextValue) => {
    setEditableFields((prev) => ({ ...prev, [field]: nextValue }));
  };

  useEffect(() => {
    if (!user?.login) return;
    setEditableFields((prev) => ({ ...prev, login: user.login }));
  }, [user?.login]);

  const passwordFieldValue = passwordPreview || PASSWORD_PLACEHOLDER;

  const handleLoginConfirm = async (nextValue) => {
    const trimmed = String(nextValue || "").trim();
    if (!trimmed) return;
    try {
      const updatedUser = await updateProfile({ login: trimmed });
      updateEditableField("login", updatedUser?.login || trimmed);
      setEditingField(null);
    } catch (err) {
      console.error("Failed to update login:", err);
    }
  };

  const handlePasswordConfirm = async (nextValue) => {
    if (!String(nextValue || "").trim()) return;
    try {
      await changeMyPassword({ password: nextValue });
      setEditingField(null);
    } catch (err) {
      console.error("Failed to update password:", err);
    }
  };

  return (
    <>
      <section className="lk-header-row">
        <div className={containerClass}>
          <div className="lk-header-row-content">
            <div className="lk-header-left">
              <h1 className="h2 m-0 text-center md:text-left">Личный кабинет</h1>
              <button type="button" className={`${mainText} link-button lk-history-link`} onClick={() => setHistoryModalOpen(true)}>
                Посмотреть историю платежей
              </button>
            </div>
            <button type="button" className={`${mainText} link-button lk-logout hidden md:block`} onClick={() => setLogoutModalOpen(true)}>
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </section>

      <section className="lk-content">
        <div className={containerClass}>
          <div className="lk-content-grid">
            <div className="lk-column w-full lg:max-w-[570px] lg:flex-[0_0_570px] lg:min-w-0 max-md:pb-[24px] max-md:border-b max-md:border-[#F2F2F2] max-md:mb-[24px]">
              <div className="flex h-full min-h-0 flex-col">
                <div className="overflow-visible lg:flex-1 lg:min-h-0 lg:max-h-[510px] lg:overflow-y-auto lg:pr-4">
                  <div className="flex flex-col gap-[16px]">
                    {lkSubscriptions.map((sub, index) => {
                      const previewCardBackgrounds = ["bg-[#CFFFD7]", "bg-[#FFF9CF]", "bg-[#FFE3E3]"];
                      const previewCardBorders = ["border-[#CFFFD7]", "border-[#FFF9CF]", "border-[#FFE3E3]"];
                      const cardBackgroundClass = {
                        active: index === 0 ? previewCardBackgrounds[0] : "bg-[#CFFFD7]",
                        warning: index === 1 ? previewCardBackgrounds[1] : "bg-[#FFF9CF]",
                        expired: index === 2 ? previewCardBackgrounds[2] : "bg-[#FFE3E3]",
                        inactive: "bg-white",
                      }[sub.status] ?? "bg-white";
                      const cardBorderClass = {
                        active: index === 0 ? previewCardBorders[0] : "border-[#CFFFD7]",
                        warning: index === 1 ? previewCardBorders[1] : "border-[#FFF9CF]",
                        expired: index === 2 ? previewCardBorders[2] : "border-[#FFE3E3]",
                        inactive: "border-[#F2F2F2]",
                      }[sub.status] ?? "border-[#F2F2F2]";
                      const visibilityClass = index === 0 || showAllSports ? "block" : "hidden md:block";

                      if (sub.status === "inactive") {
                        return (
                          <article
                            key={sub.id}
                            className={`${visibilityClass} ${cardBackgroundClass} ${cardBorderClass} border min-h-[154px] rounded-[16px] p-[24px]`}
                          >
                            <div className="flex flex-col gap-[16px]">
                              <div className="flex items-start justify-between gap-[16px]">
                                <span className="text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">{sub.name}</span>
                              </div>
                              <div className="flex flex-col gap-[16px] md:flex-row md:items-end md:justify-between">
                                <div className="flex flex-col gap-[4px]">
                                  <span className={`${mainText} text-[#1A1A1A]`}>Подписка неактивна</span>
                                </div>
                                <button
                                  className="w-full md:w-auto md:min-w-[151px] border-none rounded-[8px] px-[32px] py-[16px] bg-[#F8F8F8] text-[20px] leading-[1.25] font-light text-[#1A1A1A] cursor-pointer"
                                  onClick={() => setActiveModal({ id: sub.id, title: sub.name, mode: "buy" })}
                                >
                                  Купить
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      }

                      if (sub.status === "expired") {
                        return (
                          <article
                            key={sub.id}
                            className={`${visibilityClass} ${cardBackgroundClass} ${cardBorderClass} border min-h-[154px] rounded-[16px] p-[24px]`}
                          >
                            <div className="flex flex-col gap-[16px]">
                              <div className="flex items-start justify-between gap-[16px]">
                                <span className="text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">{sub.name}</span>
                              </div>
                              <div className="flex flex-col gap-[16px] md:flex-row md:items-end md:justify-between">
                                <div className="flex flex-col gap-[4px]">
                                  <span className={`${mainText} text-[#1A1A1A]`}>Подписка истекла</span>
                                </div>
                                <button
                                  className="w-full md:w-auto md:min-w-[151px] border-none rounded-[8px] px-[32px] py-[16px] bg-[#F8F8F8] text-[20px] leading-[1.25] font-light text-[#1A1A1A] cursor-pointer"
                                  onClick={() => setActiveModal({ id: sub.id, title: sub.name, mode: "buy" })}
                                >
                                  Купить
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      }

                      return (
                        <article
                          key={sub.id}
                          className={`${visibilityClass} ${cardBackgroundClass} ${cardBorderClass} border min-h-[154px] rounded-[16px] p-[24px]`}
                        >
                          <div className="flex flex-col gap-[16px]">
                            <div className="flex items-start justify-between gap-[16px]">
                              <span className="text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">{sub.name}</span>
                              <span className={`${mainText} text-right text-[#8D8D8D]`}>{sub.since}</span>
                            </div>
                            <div className="flex flex-col gap-[16px] md:flex-row md:items-end md:justify-between">
                              <div className="flex flex-col gap-[4px]">
                                <span className={`${mainText} text-[#8D8D8D]`}>Подписка активна до</span>
                                <div className="flex flex-wrap items-baseline gap-x-[8px] gap-y-[4px]">
                                  <span className={`${mainText} text-[#1A1A1A] font-bold`}>{sub.until}</span>
                                  {!!sub.details && <span className={`${mainText} text-[#8D8D8D]`}>({sub.details})</span>}
                                </div>
                              </div>
                              <button
                                className="w-full md:w-auto md:min-w-[151px] border-none rounded-[8px] px-[32px] py-[16px] bg-[#F8F8F8] text-[20px] leading-[1.25] font-light text-[#1A1A1A] cursor-pointer"
                                onClick={() => setActiveModal({ id: sub.id, title: sub.name, mode: "renew" })}
                              >
                                Продлить
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
                {!showAllSports && lkSubscriptions.length > 1 && (
                  <button
                    type="button"
                    className={`${mainText} link-button self-center mt-[16px] md:hidden`}
                    onClick={() => setShowAllSports(true)}
                  >
                    Посмотреть все виды спорта
                  </button>
                )}
              </div>
            </div>

            <div className="lk-column w-full lg:max-w-[425px] lg:flex-[0_0_425px] max-md:pb-[24px] max-md:border-b max-md:border-[#F2F2F2] max-md:mb-[24px]">
              {/* <h2 className="">Основные данные</h2> */}

              <EditableField
                label="Почта/Логин"
                value={editableFields.login}
                isEditing={editingField === "login"}
                onStartEdit={() => setEditingField("login")}
                onConfirm={handleLoginConfirm}
                onClear={() => setEditingField(null)}
                onExitWithoutSave={() => setEditingField(null)}
                mainText={mainText}
                fieldValueClass={fieldValueClass}
              />

              <EditableField
                label="Пароль"
                value={passwordFieldValue}
                editingValue={passwordPreview || ""}
                isEditing={editingField === "password"}
                onStartEdit={() => setEditingField("password")}
                onConfirm={handlePasswordConfirm}
                onClear={() => { setEditingField(null); setIsPasswordVisible(false); }}
                onExitWithoutSave={() => { setEditingField(null); setIsPasswordVisible(false); }}
                mainText={mainText}
                fieldValueClass={fieldValueClass}
                inputType={isPasswordVisible ? "text" : "password"}
                secondaryControl={
                  editingField === "password" ? (
                    <button
                      type="button"
                      className={`border-none bg-transparent p-0 cursor-pointer shrink-0 ${isPasswordVisible ? "text-[#00459D]" : "text-[#8D8D8D] lg:group-hover:text-[#00459D]"}`}
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
                    >
                      <EyeFieldSvg active={isPasswordVisible} />
                    </button>
                  ) : null
                }
              />

              <div className="field-group">
                <label className={`${mainText} field-label`}>Привязанные устройства</label>
                <div className="flex flex-col gap-[16px]">
                  {devices.length === 0 ? (
                    <div className="devices-empty flex flex-col items-center gap-[16px] rounded-[16px] border border-[#F2F2F2] p-[34px]">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M16.3713 30.1643C8.7657 30.1643 2.57812 23.9767 2.57812 16.3713C2.57812 8.7657 8.7657 2.57812 16.3713 2.57812C23.9767 2.57812 30.1643 8.7657 30.1643 16.3713C30.1643 23.9767 23.9767 30.1643 16.3713 30.1643ZM16.3713 5.33672C10.2871 5.33672 5.33672 10.2871 5.33672 16.3713C5.33672 22.4554 10.2871 27.4057 16.3713 27.4057C22.4554 27.4057 27.4057 22.4554 27.4057 16.3713C27.4057 10.2871 22.4567 5.33672 16.3713 5.33672Z"
                          fill="#D3D3D1"
                        />
                        <path
                          d="M36.0852 37.4644C35.9041 37.4646 35.7247 37.429 35.5573 37.3596C35.39 37.2903 35.238 37.1885 35.1101 37.0603L24.4977 26.4478C24.3696 26.3198 24.268 26.1678 24.1987 26.0005C24.1294 25.8331 24.0937 25.6538 24.0938 25.4727C24.0937 25.2459 24.1496 25.0226 24.2565 24.8225C24.3634 24.6225 24.518 24.4519 24.7066 24.3259C24.8952 24.1999 25.1119 24.1224 25.3377 24.1001C25.5634 24.0779 25.7911 24.1117 26.0006 24.1985C26.168 24.2679 26.32 24.3695 26.448 24.4975L37.0605 35.11C37.2052 35.254 37.316 35.4283 37.3851 35.6204C37.4541 35.8125 37.4796 36.0176 37.4597 36.2208C37.4398 36.4239 37.375 36.6201 37.27 36.7952C37.165 36.9702 37.0224 37.1198 36.8526 37.233C36.6254 37.3845 36.3583 37.465 36.0852 37.4644Z"
                          fill="#D3D3D1"
                        />
                      </svg>
                      <p className={`${mainText} devices-empty-text max-w-[309px]`}>
                        Кажется, вы&nbsp;еще не&nbsp;привязали ни&nbsp;одно устройство
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="devices-list">
                        {devices.map((device, index) => (
                          <div
                            className="device-row"
                            key={device.name + index}
                          >
                            <DeviceTypeIcon deviceName={device.name} />
                            <div className="device-info">
                              <div className={`${mainText} device-name text-[#1A1A1A]`}>{device.name}</div>
                              <div className={`${mainText} device-meta text-[#8D8D8D] md:!text-[16px]`}>{device.location}</div>
                            </div>
                            <button
                              className="device-remove"
                              aria-label="Удалить"
                              onClick={() => setDeviceToRemove(device)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className={`${mainText} devices-hint text-center font-bold md:text-left md:font-light`}>
                        Удалить привязанное устройство можно 1 раз в месяц
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="lk-column w-full lg:max-w-[425px] lg:flex-[0_0_425px]">
              {/* <h2 className="">Опциональная информация</h2> */}

              <EditableField
                label="Фамилия"
                value={editableFields.surname}
                isEditing={editingField === "surname"}
                onStartEdit={() => setEditingField("surname")}
                onConfirm={(val) => { updateEditableField("surname", val); setEditingField(null); }}
                onClear={() => setEditingField(null)}
                onExitWithoutSave={() => setEditingField(null)}
                mainText={mainText}
                fieldValueClass={fieldValueClass}
              />

              <EditableField
                label="Имя"
                value={editableFields.firstName}
                isEditing={editingField === "firstName"}
                onStartEdit={() => setEditingField("firstName")}
                onConfirm={(val) => { updateEditableField("firstName", val); setEditingField(null); }}
                onClear={() => setEditingField(null)}
                onExitWithoutSave={() => setEditingField(null)}
                mainText={mainText}
                fieldValueClass={fieldValueClass}
              />

              <EditableField
                label="Дата рождения"
                value={editableFields.birthDate}
                isEditing={editingField === "birthDate"}
                onStartEdit={() => setEditingField("birthDate")}
                onConfirm={(val) => { updateEditableField("birthDate", val); setEditingField(null); }}
                onClear={() => setEditingField(null)}
                onExitWithoutSave={() => setEditingField(null)}
                mainText={mainText}
                fieldValueClass={fieldValueClass}
              />

              <EditableField
                label="Клуб"
                value={editableFields.club}
                isEditing={editingField === "club"}
                onStartEdit={() => setEditingField("club")}
                onConfirm={(val) => { updateEditableField("club", val); setEditingField(null); }}
                onClear={() => setEditingField(null)}
                onExitWithoutSave={() => setEditingField(null)}
                mainText={mainText}
                fieldValueClass={fieldValueClass}
              />
            </div>
          </div>
        </div>
      </section>

      <div className={`${containerClass} flex justify-center md:hidden mt-[32px]`}>
        <button type="button" className={`${mainText} link-button lk-logout`} onClick={() => setLogoutModalOpen(true)}>
          Выйти из аккаунта
        </button>
      </div>
    </>
  );
}

