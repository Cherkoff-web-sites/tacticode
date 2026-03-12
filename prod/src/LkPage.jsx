import React, { useState, useEffect, useRef, useMemo } from "react";
import { subscriptionItems } from "./data";
import { useApp } from "./context/AppContext";
import { apiRequestLoginChange } from "./api/client";

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

function CalendarFieldSvg({ active, inheritColor }) {
  const colorClass = inheritColor
    ? "shrink-0"
    : active
      ? "text-[#00459D] shrink-0"
      : "text-[#8D8D8D] shrink-0";
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-4 h-4 ${colorClass}`}
      aria-hidden="true"
    >
      <g clipPath="url(#calendar-field-clip)">
        <path d="M15 3.46508V5.50008H1V3.46508C1.00514 3.07206 1.16594 2.69712 1.44714 2.42248C1.72833 2.14785 2.10696 1.99594 2.5 2.00008H3.5V3.00008C3.5 3.39791 3.65804 3.77944 3.93934 4.06074C4.22064 4.34205 4.60218 4.50008 5 4.50008C5.39782 4.50008 5.77936 4.34205 6.06066 4.06074C6.34196 3.77944 6.5 3.39791 6.5 3.00008V2.00008H9.5V3.00008C9.5 3.39791 9.65804 3.77944 9.93934 4.06074C10.2206 4.34205 10.6022 4.50008 11 4.50008C11.3978 4.50008 11.7794 4.34205 12.0607 4.06074C12.342 3.77944 12.5 3.39791 12.5 3.00008V2.00008H13.5C13.893 1.99594 14.2717 2.14785 14.5529 2.42248C14.8341 2.69712 14.9949 3.07206 15 3.46508ZM1 6.50008V14.5351C1.00514 14.9281 1.16594 15.303 1.44714 15.5777C1.72833 15.8523 2.10696 16.0042 2.5 16.0001H13.5C13.893 16.0042 14.2717 15.8523 14.5529 15.5777C14.8341 15.303 14.9949 14.9281 15 14.5351V6.50008H1ZM5.5 13.5001C5.4996 13.6326 5.4468 13.7595 5.35312 13.8532C5.25943 13.9469 5.13249 13.9997 5 14.0001H4C3.86751 13.9997 3.74057 13.9469 3.64688 13.8532C3.5532 13.7595 3.5004 13.6326 3.5 13.5001V12.5001C3.5004 12.3676 3.5532 12.2406 3.64688 12.147C3.74057 12.0533 3.86751 12.0005 4 12.0001H5C5.13249 12.0005 5.25943 12.0533 5.35312 12.147C5.4468 12.2406 5.4996 12.3676 5.5 12.5001V13.5001ZM5.5 10.0001C5.4996 10.1326 5.4468 10.2595 5.35312 10.3532C5.25943 10.4469 5.13249 10.4997 5 10.5001H4C3.86751 10.4997 3.74057 10.4469 3.64688 10.3532C3.5532 10.2595 3.5004 10.1326 3.5 10.0001V9.00008C3.5004 8.8676 3.5532 8.74065 3.64688 8.64697C3.74057 8.55328 3.86751 8.50048 4 8.50008H5C5.13249 8.50048 5.25943 8.55328 5.35312 8.64697C5.4468 8.74065 5.4996 8.8676 5.5 9.00008V10.0001ZM9 13.5001C8.9996 13.6326 8.9468 13.7595 8.85312 13.8532C8.75943 13.9469 8.63249 13.9997 8.5 14.0001H7.5C7.36751 13.9997 7.24057 13.9469 7.14688 13.8532C7.0532 13.7595 7.0004 13.6326 7 13.5001V12.5001C7.0004 12.3676 7.0532 12.2406 7.14688 12.147C7.24057 12.0533 7.36751 12.0005 7.5 12.0001H8.5C8.63249 12.0005 8.75943 12.0533 8.85312 12.147C8.9468 12.2406 8.9996 12.3676 9 12.5001V13.5001ZM9 10.0001C8.9996 10.1326 8.9468 10.2595 8.85312 10.3532C8.75943 10.4469 8.63249 10.4997 8.5 10.5001H7.5C7.36751 10.4997 7.24057 10.4469 7.14688 10.3532C7.0532 10.2595 7.0004 10.1326 7 10.0001V9.00008C7.0004 8.8676 7.0532 8.74065 7.14688 8.64697C7.24057 8.55328 7.36751 8.50048 7.5 8.50008H8.5C8.63249 8.50048 8.75943 8.55328 8.85312 8.64697C8.9468 8.74065 8.9996 8.8676 9 9.00008V10.0001ZM12.5 10.0001C12.4996 10.1326 12.4468 10.2595 12.3531 10.3532C12.2594 10.4469 12.1325 10.4997 12 10.5001H11C10.8675 10.4997 10.7406 10.4469 10.6469 10.3532C10.5532 10.2595 10.5004 10.1326 10.5 10.0001V9.00008C10.5004 8.8676 10.5532 8.74065 10.6469 8.64697C10.7406 8.55328 10.8675 8.50048 11 8.50008H12C12.1325 8.50048 12.2594 8.55328 12.3531 8.64697C12.4468 8.74065 12.4996 8.8676 12.5 9.00008V10.0001Z" fill="currentColor"/>
        <path d="M5.5 2V3C5.5 3.13261 5.44732 3.25979 5.35355 3.35355C5.25979 3.44732 5.13261 3.5 5 3.5C4.86739 3.5 4.74021 3.44732 4.64645 3.35355C4.55268 3.25979 4.5 3.13261 4.5 3V2C4.5 1.86739 4.55268 1.74021 4.64645 1.64645C4.74021 1.55268 4.86739 1.5 5 1.5C5.13261 1.5 5.25979 1.55268 5.35355 1.64645C5.44732 1.74021 5.5 1.86739 5.5 2ZM11.5 2V3C11.5 3.13261 11.4473 3.25979 11.3536 3.35355C11.2598 3.44732 11.1326 3.5 11 3.5C10.8674 3.5 10.7402 3.44732 10.6464 3.35355C10.5527 3.25979 10.5 3.13261 10.5 3V2C10.5 1.86739 10.5527 1.74021 10.6464 1.64645C10.7402 1.55268 10.8674 1.5 11 1.5C11.1326 1.5 11.2598 1.55268 11.3536 1.64645C11.4473 1.74021 11.5 1.86739 11.5 2Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="calendar-field-clip">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function EyeFieldSvg({ active, inheritColor }) {
  const colorClass = inheritColor
    ? "shrink-0"
    : active
      ? "text-[#00459D] shrink-0"
      : "text-[#8D8D8D] lg:group-hover:text-[#00459D] shrink-0";
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-[18px] h-[18px] ${colorClass}`} aria-hidden="true">
      <path d="M9 3.63525C5.56091 3.63525 2.44216 5.51681 0.140841 8.57296C-0.0469469 8.82335 -0.0469469 9.17315 0.140841 9.42353C2.44216 12.4834 5.56091 14.3649 9 14.3649C12.4391 14.3649 15.5578 12.4834 17.8592 9.42721C18.0469 9.17683 18.0469 8.82703 17.8592 8.57665C15.5578 5.51681 12.4391 3.63525 9 3.63525ZM9.2467 12.7779C6.96379 12.9215 5.07855 11.04 5.22215 8.75339C5.33998 6.86815 6.86806 5.34007 8.7533 5.22224C11.0362 5.07864 12.9214 6.9602 12.7778 9.24679C12.6563 11.1283 11.1283 12.6564 9.2467 12.7779ZM9.13256 11.0326C7.90273 11.1099 6.88647 10.0974 6.96747 8.86753C7.03007 7.85127 7.85486 7.03016 8.87113 6.96388C10.101 6.88656 11.1172 7.89914 11.0362 9.12896C10.9699 10.1489 10.1451 10.97 9.13256 11.0326Z" fill="currentColor"/>
    </svg>
  );
}

function formatBirthDateInput(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 8);
  if (!digits) return "";
  const chars = "__.__.____".split("");
  for (let i = 0; i < digits.length; i += 1) {
    const charIndex = i < 2 ? i : i < 4 ? i + 1 : i + 2;
    chars[charIndex] = digits[i];
  }
  return chars.join("");
}

function formatBirthDateFromApi(value) {
  if (!value) return "";
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}.${month}.${year}`;
  }
  return "";
}

function formatBirthDateToApi(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 8) return null;
  const normalized = formatBirthDateInput(value);
  const [day, month, year] = normalized.split(".");
  const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCDate() !== Number(day)
  ) {
    return null;
  }
  return `${year}-${month}-${day}`;
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
  inputMode,
  placeholder = "",
  formatDraftValue,
  secondaryControl = null,
}) {
  const normalizedValue = value ?? "";
  const normalizedEditingValue = editingValue ?? "";
  const [draft, setDraft] = useState(normalizedValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const initialValueRef = useRef(normalizedValue);
  const wasEditingRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      if (!wasEditingRef.current) {
        wasEditingRef.current = true;
        setDraft(normalizedEditingValue);
        initialValueRef.current = normalizedEditingValue;
      }
      inputRef.current?.focus();
    } else {
      wasEditingRef.current = false;
      setIsFocused(false);
      setDraft(normalizedValue);
      initialValueRef.current = normalizedValue;
    }
  }, [isEditing, normalizedEditingValue, normalizedValue]);

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

  const wrapperBgClass = isEditing ? "!bg-[#F2F5FA]" : "lg:hover:!bg-[#F2F5FA]";
  const resolvedSecondaryControl =
    typeof secondaryControl === "function"
      ? secondaryControl({
          draft,
          hasChanges,
          inputRef,
          isEditing,
          isFocused,
          setDraft,
        })
      : secondaryControl;

  return (
    <div ref={wrapperRef} className="field-group">
      <label className={`${mainText} field-label`}>{label}</label>
      <div className={`${fieldValueClass} gap-[16px] ${wrapperBgClass} cursor-default`}>
        <input
          ref={inputRef}
          type={inputType}
          inputMode={inputMode}
          placeholder={placeholder}
          value={isEditing ? draft : normalizedValue}
          onChange={(e) => {
            const nextValue = e.target.value;
            setDraft(formatDraftValue ? formatDraftValue(nextValue) : nextValue);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={!isEditing}
          className={`w-full min-w-0 border-none outline-none bg-transparent p-0 text-[20px] leading-[1.25] font-light text-[#000] placeholder:text-[#8D8D8D] ${isEditing ? "cursor-text" : "cursor-default"}`}
        />
        {isEditing ? (
          hasChanges ? (
            <div className="flex items-center gap-[16px] shrink-0">
              {resolvedSecondaryControl}
              <button type="button" className="border-none bg-transparent p-0 cursor-pointer" onClick={onClear} aria-label={`Отменить редактирование ${label}`}>
                <ClearFieldSvg />
              </button>
              <button type="button" className="border-none bg-transparent p-0 cursor-pointer" onClick={() => onConfirm(draft)} aria-label={`Сохранить поле ${label}`}>
                <ConfirmFieldSvg />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-[16px] shrink-0">
              {resolvedSecondaryControl}
              <button
                type="button"
                className="border-none bg-transparent p-0 cursor-pointer shrink-0 text-[#00459D]"
                onClick={onStartEdit}
                aria-label={`Редактировать поле ${label}`}
              >
                <EditFieldSvg active />
              </button>
            </div>
          )
        ) : (
          <div className="flex items-center gap-[16px] shrink-0">
            {resolvedSecondaryControl}
            <button
              type="button"
              className="border-none bg-transparent p-0 cursor-pointer shrink-0 text-[#8D8D8D] lg:hover:text-[#00459D] active:text-[#00459D]"
              onClick={onStartEdit}
              aria-label={`Редактировать поле ${label}`}
            >
              <EditFieldSvg active={false} />
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
  const secondaryButtonClass = "w-full md:w-auto md:self-start flex justify-center items-center px-[40px] py-[16px] rounded-full border-none text-[20px] leading-[1.25] font-light text-[#00459D] bg-[#F2F5FA] cursor-pointer transition-colors md:hover:bg-[#00459D] md:hover:text-white active:bg-[#003982] active:text-white disabled:cursor-not-allowed disabled:opacity-70";
  const [showAllSports, setShowAllSports] = useState(false);
  const [editableFields, setEditableFields] = useState({
    login: "",
    surname: "",
    firstName: "",
    birthDate: "",
    club: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isBirthDateCalendarOpen, setIsBirthDateCalendarOpen] = useState(false);
  const [loginChangeError, setLoginChangeError] = useState("");
  const [profileSaveError, setProfileSaveError] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const birthDatePickerRef = useRef(null);
  const {
    user,
    subscriptions,
    devices,
    setHistoryModalOpen,
    setLogoutModalOpen,
    setActiveModal,
    setDeviceToRemove,
    changeMyPassword,
    saveProfileDetails,
    setCodePurpose,
    setCodeEmail,
    setCodeModalOpen,
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

  const persistedProfileFields = useMemo(() => ({
    surname: user?.surname || "",
    firstName: user?.firstName || "",
    birthDate: formatBirthDateFromApi(user?.birthDate),
    club: user?.club || "",
  }), [user?.surname, user?.firstName, user?.birthDate, user?.club]);

  useEffect(() => {
    setEditableFields({
      login: user?.login || "",
      surname: persistedProfileFields.surname,
      firstName: persistedProfileFields.firstName,
      birthDate: persistedProfileFields.birthDate,
      club: persistedProfileFields.club,
    });
  }, [persistedProfileFields, user?.login]);

  const passwordFieldValue = PASSWORD_PLACEHOLDER;
  const profileFieldKeys = ["surname", "firstName", "birthDate", "club"];
  const hasAnyProfileValue = profileFieldKeys.some((key) => String(editableFields[key] || "").trim());
  const hasUnsavedProfileChanges = profileFieldKeys.some(
    (key) => String(editableFields[key] || "") !== String(persistedProfileFields[key] || "")
  );
  const isProfileComplete = profileFieldKeys.every((key) => String(persistedProfileFields[key] || "").trim());
  const shouldShowFillProfileButton = !isProfileComplete || hasUnsavedProfileChanges;

  const handleLoginConfirm = async (nextValue) => {
    const trimmed = String(nextValue || "").trim();
    if (!trimmed) return;
    setLoginChangeError("");
    try {
      await apiRequestLoginChange(trimmed);
      setCodePurpose("change_login");
      setCodeEmail(trimmed);
      setCodeModalOpen(true);
      setEditingField(null);
    } catch (err) {
      setLoginChangeError(err?.message || "Не удалось отправить код");
      console.error("Failed to request login change:", err);
    }
  };

  const handlePasswordConfirm = async (nextValue) => {
    if (!String(nextValue || "").trim()) return;
    try {
      await changeMyPassword({ password: nextValue });
      setIsPasswordVisible(false);
      setEditingField(null);
    } catch (err) {
      console.error("Failed to update password:", err);
    }
  };

  const handleProfileSave = async () => {
    setProfileSaveError("");

    if (!hasAnyProfileValue) {
      setProfileSaveError("Заполните хотя бы одно поле");
      return;
    }

    if (editableFields.birthDate && !formatBirthDateToApi(editableFields.birthDate)) {
      setProfileSaveError("Дата рождения должна быть в формате ДД.ММ.ГГГГ");
      return;
    }

    try {
      setIsProfileSaving(true);
      await saveProfileDetails({
        surname: editableFields.surname.trim() || null,
        firstName: editableFields.firstName.trim() || null,
        birthDate: formatBirthDateToApi(editableFields.birthDate),
        club: editableFields.club.trim() || null,
      });
      setEditingField(null);
    } catch (err) {
      setProfileSaveError(err?.message || "Не удалось сохранить профиль");
    } finally {
      setIsProfileSaving(false);
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

              <div>
                <EditableField
                  label="Почта/Логин"
                  value={editableFields.login}
                  isEditing={editingField === "login"}
                  onStartEdit={() => { setEditingField("login"); setLoginChangeError(""); }}
                  onConfirm={handleLoginConfirm}
                  onClear={() => {
                    setEditingField(null);
                    setLoginChangeError("");
                  }}
                  onExitWithoutSave={() => setEditingField(null)}
                  mainText={mainText}
                  fieldValueClass={fieldValueClass}
                />
                {loginChangeError && (
                  <p className={`${mainText} mt-1 text-[#FF383C]`}>{loginChangeError}</p>
                )}
              </div>

              <EditableField
                label="Пароль"
                value={passwordFieldValue}
                editingValue=""
                isEditing={editingField === "password"}
                onStartEdit={() => {
                  setEditingField("password");
                  setIsPasswordVisible(false);
                }}
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
                      className={`group/eye border-none bg-transparent p-0 cursor-pointer shrink-0 ${isPasswordVisible ? "text-[#00459D]" : "text-[#8D8D8D] lg:group-hover/eye:text-[#00459D] active:text-[#00459D]"}`}
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
                    >
                      <EyeFieldSvg active={isPasswordVisible} inheritColor />
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
                onStartEdit={() => { setEditingField("surname"); setProfileSaveError(""); }}
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
                onStartEdit={() => { setEditingField("firstName"); setProfileSaveError(""); }}
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
                onStartEdit={() => {
                  setEditingField("birthDate");
                  setProfileSaveError("");
                  setIsBirthDateCalendarOpen(false);
                }}
                onConfirm={(val) => {
                  updateEditableField("birthDate", formatBirthDateInput(val));
                  setIsBirthDateCalendarOpen(false);
                  setEditingField(null);
                }}
                onClear={() => { setEditingField(null); setIsBirthDateCalendarOpen(false); }}
                onExitWithoutSave={() => { setEditingField(null); setIsBirthDateCalendarOpen(false); }}
                mainText={mainText}
                fieldValueClass={fieldValueClass}
                inputMode="numeric"
                placeholder="__.__.____"
                formatDraftValue={formatBirthDateInput}
                secondaryControl={({ draft, isEditing, isFocused, setDraft }) => (
                  isEditing && isFocused ? (
                    <>
                      <input
                        ref={birthDatePickerRef}
                        type="date"
                        tabIndex={-1}
                        value={formatBirthDateToApi(draft) || ""}
                        onFocus={() => setIsBirthDateCalendarOpen(true)}
                        onBlur={() => setIsBirthDateCalendarOpen(false)}
                        onChange={(e) => {
                          setDraft(formatBirthDateFromApi(e.target.value));
                          setIsBirthDateCalendarOpen(false);
                        }}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        className={`group/eye border-none bg-transparent p-0 cursor-pointer shrink-0 ${isBirthDateCalendarOpen ? "text-[#00459D]" : "text-[#8D8D8D] lg:group-hover/eye:text-[#00459D] active:text-[#00459D]"}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setIsBirthDateCalendarOpen(true);
                          if (birthDatePickerRef.current?.showPicker) {
                            birthDatePickerRef.current.showPicker();
                            return;
                          }
                          birthDatePickerRef.current?.click();
                        }}
                        aria-label="Открыть календарь"
                      >
                        <CalendarFieldSvg active={isBirthDateCalendarOpen} inheritColor />
                      </button>
                    </>
                  ) : null
                )}
              />

              <EditableField
                label="Клуб"
                value={editableFields.club}
                isEditing={editingField === "club"}
                onStartEdit={() => { setEditingField("club"); setProfileSaveError(""); }}
                onConfirm={(val) => { updateEditableField("club", val); setEditingField(null); }}
                onClear={() => setEditingField(null)}
                onExitWithoutSave={() => setEditingField(null)}
                mainText={mainText}
                fieldValueClass={fieldValueClass}
              />

              {shouldShowFillProfileButton && (
                <div className="mt-[16px] flex flex-col gap-[8px]">
                  <button
                    type="button"
                    className={secondaryButtonClass}
                    onClick={handleProfileSave}
                    disabled={isProfileSaving || !hasAnyProfileValue}
                  >
                    {isProfileSaving ? "Сохраняем..." : "Заполнить профиль"}
                  </button>
                  {profileSaveError && (
                    <p className={`${mainText} text-[#FF383C]`}>{profileSaveError}</p>
                  )}
                </div>
              )}
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

