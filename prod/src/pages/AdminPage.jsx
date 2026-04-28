import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseModal from "../components/BaseModal";
import { useApp } from "../context/AppContext";
import { subscriptionItems } from "../data";

const secondButtonClass =
  "w-full md:w-auto md:self-start flex justify-center items-center px-[40px] py-[16px] rounded-full border-none text-[20px] leading-[1.25] font-light text-[#00459D] bg-[#F2F5FA] cursor-pointer transition-colors md:hover:bg-[#00459D] md:hover:text-white active:bg-[#003982] active:text-white";
const primaryModalButtonClass =
  "w-full md:w-auto md:self-start flex justify-center items-center px-[40px] py-[16px] rounded-full border-none text-[20px] leading-[1.25] font-light text-white bg-[#00459D] cursor-pointer transition-colors md:hover:bg-[#F2F5FA] md:hover:text-[#00459D] active:bg-[#D9E3F1] active:text-[#00459D]";
const smallActionButtonClass =
  "inline-flex items-center justify-center rounded-full border-none px-[16px] py-[10px] text-[14px] md:text-[16px] leading-[1.25] font-light cursor-pointer transition-colors bg-[#F2F5FA] text-[#00459D] md:hover:bg-[#00459D] md:hover:text-white active:bg-[#003982] active:text-white";

const mainText = "text-[16px] md:text-[20px] leading-[1.25] font-light";

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDateOnly(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatBirthDate(value) {
  if (!value) return "—";
  const stringValue = String(value).trim();
  const match = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[3]}.${match[2]}.${match[1]}`;
  }
  return stringValue;
}

function getPlanLabel(plan) {
  return plan === "year" ? "1 год" : "1 месяц";
}

function getMethodLabel(method) {
  if (method === "qr") return "QR / СБП";
  if (method === "card") return "Банковская карта";
  return method || "—";
}

function getCodePurposeLabel(purpose) {
  switch (purpose) {
    case "register":
      return "Регистрация";
    case "reset":
      return "Сброс пароля";
    case "change_login":
      return "Смена логина";
    case "admin_login":
      return "Вход супер-админа";
    default:
      return purpose || "—";
  }
}

function pluralizeRu(value, one, few, many) {
  const abs = Math.abs(value) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}

function formatMembershipDuration(registeredAt) {
  if (!registeredAt) return "0 дней";
  const start = new Date(registeredAt);
  if (Number.isNaN(start.getTime())) return "0 дней";

  const now = new Date();
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  if (now.getDate() < start.getDate()) {
    months -= 1;
  }

  if (months < 0) months = 0;

  if (months >= 12) {
    const years = Math.floor(months / 12);
    const remainMonths = months % 12;
    return remainMonths > 0
      ? `${years} ${pluralizeRu(years, "год", "года", "лет")} ${remainMonths} ${pluralizeRu(remainMonths, "месяц", "месяца", "месяцев")}`
      : `${years} ${pluralizeRu(years, "год", "года", "лет")}`;
  }

  if (months >= 1) {
    const anchor = new Date(start);
    anchor.setMonth(anchor.getMonth() + months);
    const diffDays = Math.max(Math.floor((now - anchor) / (1000 * 60 * 60 * 24)), 0);
    return diffDays > 0
      ? `${months} ${pluralizeRu(months, "месяц", "месяца", "месяцев")} ${diffDays} ${pluralizeRu(diffDays, "день", "дня", "дней")}`
      : `${months} ${pluralizeRu(months, "месяц", "месяца", "месяцев")}`;
  }

  const diffDays = Math.max(Math.floor((now - start) / (1000 * 60 * 60 * 24)), 0);
  return `${diffDays} ${pluralizeRu(diffDays, "день", "дня", "дней")}`;
}

export function AdminPage() {
  const navigate = useNavigate();
  const {
    user,
    isAuthResolved,
    adminUsers,
    isAdminUsersLoading,
    loadAdminUsers,
    getAdminUserDetails,
    removeAdminUserDevice,
    removeAdminUser,
  } = useApp();

  const [pageError, setPageError] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeActionUserId, setActiveActionUserId] = useState(null);
  const [deletingDeviceId, setDeletingDeviceId] = useState(null);

  useEffect(() => {
    if (!isAuthResolved) return;
    if (!user || user.role !== "super_admin") {
      navigate("/");
      return;
    }

    loadAdminUsers().catch((err) => {
      setPageError(err?.message || "Не удалось загрузить пользователей");
    });
  }, [isAuthResolved, user, navigate]);

  const subscriptionNameMap = useMemo(
    () => new Map(subscriptionItems.map((item) => [item.id, item.name])),
    []
  );

  const getSubscriptionName = (id) => subscriptionNameMap.get(id) || id || "Подписка";

  const summary = useMemo(() => {
    return adminUsers.reduce(
      (acc, current) => {
        acc.totalUsers += 1;
        acc.totalDevices += Number(current.devicesCount || 0);
        acc.totalActiveSubscriptions += Number(current.activeSubscriptionsCount || 0);
        acc.totalHistory += Number(current.historyCount || 0);
        acc.totalCodes += Number(current.activeCodesCount || 0);
        return acc;
      },
      {
        totalUsers: 0,
        totalDevices: 0,
        totalActiveSubscriptions: 0,
        totalHistory: 0,
        totalCodes: 0,
      }
    );
  }, [adminUsers]);

  const openUserDetails = async (userId) => {
    setActiveActionUserId(userId);
    setDetailLoading(true);
    setDetailError("");
    setDetailModalOpen(true);
    try {
      const data = await getAdminUserDetails(userId);
      setDetailData(data);
    } catch (err) {
      setDetailData(null);
      setDetailError(err?.message || "Не удалось загрузить данные пользователя");
    } finally {
      setDetailLoading(false);
      setActiveActionUserId(null);
    }
  };

  const openUserHistory = async (userId) => {
    setActiveActionUserId(userId);
    setHistoryLoading(true);
    setHistoryError("");
    setHistoryModalOpen(true);
    try {
      const data = await getAdminUserDetails(userId);
      setHistoryData(data);
    } catch (err) {
      setHistoryData(null);
      setHistoryError(err?.message || "Не удалось загрузить историю пользователя");
    } finally {
      setHistoryLoading(false);
      setActiveActionUserId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    try {
      await removeAdminUser(deleteTarget.id);
      if (detailData?.user?.id === deleteTarget.id) {
        setDetailModalOpen(false);
        setDetailData(null);
      }
      if (historyData?.user?.id === deleteTarget.id) {
        setHistoryModalOpen(false);
        setHistoryData(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      setPageError(err?.message || "Не удалось удалить пользователя");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteUserDevice = async (deviceId) => {
    const userId = detailData?.user?.id;
    if (!userId || !deviceId) return;

    setDeletingDeviceId(deviceId);
    setDetailError("");
    try {
      const updatedDetails = await removeAdminUserDevice(userId, deviceId);
      setDetailData(updatedDetails);
    } catch (err) {
      setDetailError(err?.message || "Не удалось удалить устройство");
    } finally {
      setDeletingDeviceId(null);
    }
  };

  const detailFields = detailData?.user
    ? [
        ["ID", detailData.user.id],
        ["Роль", detailData.user.role],
        ["Логин", detailData.user.login || "—"],
        ["Почта", detailData.user.email || "—"],
        ["Фамилия", detailData.user.surname || "—"],
        ["Имя", detailData.user.firstName || "—"],
        ["Дата рождения", formatBirthDate(detailData.user.birthDate)],
        ["Клуб", detailData.user.club || "—"],
        ["Session version", detailData.user.sessionVersion],
        ["Зарегистрирован", formatDateTime(detailData.user.registeredAt)],
        ["Обновлен", formatDateTime(detailData.user.updatedAt)],
        ["Последняя покупка", formatDateTime(detailData.user.lastPurchaseAt)],
        ["Последняя активность устройства", formatDateTime(detailData.user.lastDeviceActiveAt)],
      ]
    : [];

  const historyItems = (historyData?.history || []).map((item) => ({
    id: item.id,
    amount: `${item.amountRub ?? 0} р`,
    date: formatDateOnly(item.createdAt),
    purchaseTerm: getPlanLabel(item.plan),
    subscriptionName: getSubscriptionName(item.sportId),
    methodLabel: "Способ оплаты",
    method: getMethodLabel(item.method),
  }));

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1868px] flex-col gap-[24px] px-[24px]">
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[16px] bg-white p-[24px]">
            <p className={`${mainText} m-0 text-[#8D8D8D]`}>Пользователей</p>
            <p className="mt-[8px] mb-0 text-[32px] leading-[1.1] font-bold text-[#1A1A1A]">
              {summary.totalUsers}
            </p>
          </div>
          <div className="rounded-[16px] bg-[#F2F5FA] p-[24px]">
            <p className={`${mainText} m-0 text-[#8D8D8D]`}>Устройств</p>
            <p className="mt-[8px] mb-0 text-[32px] leading-[1.1] font-bold text-[#1A1A1A]">
              {summary.totalDevices}
            </p>
          </div>
          <div className="rounded-[16px] bg-white p-[24px]">
            <p className={`${mainText} m-0 text-[#8D8D8D]`}>Активных подписок</p>
            <p className="mt-[8px] mb-0 text-[32px] leading-[1.1] font-bold text-[#1A1A1A]">
              {summary.totalActiveSubscriptions}
            </p>
          </div>
          <div className="rounded-[16px] bg-[#F2F5FA] p-[24px]">
            <p className={`${mainText} m-0 text-[#8D8D8D]`}>Покупок в истории</p>
            <p className="mt-[8px] mb-0 text-[32px] leading-[1.1] font-bold text-[#1A1A1A]">
              {summary.totalHistory}
            </p>
          </div>
          <div className="rounded-[16px] bg-white p-[24px]">
            <p className={`${mainText} m-0 text-[#8D8D8D]`}>Активных кодов</p>
            <p className="mt-[8px] mb-0 text-[32px] leading-[1.1] font-bold text-[#1A1A1A]">
              {summary.totalCodes}
            </p>
          </div>
        </div>

        {pageError && (
          <div className="rounded-[16px] bg-[#FFE3E3] p-[20px] text-[#FF383C]">
            <p className={`${mainText} m-0`}>{pageError}</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-[16px]">
          <h2 className="m-0 text-[24px] leading-[1.2] font-bold text-[#1A1A1A] md:text-[32px]">
            Аккаунты
          </h2>
          <button
            type="button"
            className={secondButtonClass}
            onClick={() => {
              setPageError("");
              loadAdminUsers().catch((err) => {
                setPageError(err?.message || "Не удалось обновить таблицу");
              });
            }}
          >
            Обновить
          </button>
        </div>

        <div className="hidden overflow-x-auto rounded-[24px] bg-white p-[16px] lg:block">
          <table className="min-w-[1780px] w-full border-separate border-spacing-y-[8px]">
            <thead>
              <tr className="text-left">
                {[
                  "ID",
                  "Логин / почта",
                  "Роль",
                  "Имя / фамилия",
                  "Дата рождения",
                  "Клуб",
                  "Зарегистрирован",
                  "Последняя покупка",
                  "Устройства",
                  "Активные подписки",
                  "История",
                  "Коды",
                  "Session",
                  "Действия",
                ].map((label) => (
                  <th
                    key={label}
                    className="px-[16px] py-[12px] text-[14px] font-light text-[#8D8D8D]"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((item, index) => {
                const rowBg = index % 2 === 0 ? "bg-white" : "bg-[#F8F8F8]";
                const isBusy = activeActionUserId === item.id;
                return (
                  <tr key={item.id}>
                    <td className={`${rowBg} rounded-l-[16px] px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {item.id}
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px]`}>
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-[16px] font-bold text-[#1A1A1A]">{item.login || "—"}</span>
                        <span className="text-[14px] text-[#8D8D8D]">{item.email || "—"}</span>
                      </div>
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {item.role}
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {[item.firstName, item.surname].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {formatBirthDate(item.birthDate)}
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {item.club || "—"}
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {formatDateTime(item.registeredAt)}
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {formatDateTime(item.lastPurchaseAt)}
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {item.devicesCount}
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {item.activeSubscriptionsCount}
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {item.historyCount}
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      <div className="flex flex-col gap-[4px]">
                        <span>{item.activeCodesCount}</span>
                        <span className="text-[14px] text-[#8D8D8D]">
                          до {formatDateTime(item.nearestCodeExpiresAt)}
                        </span>
                      </div>
                    </td>
                    <td className={`${rowBg} px-[16px] py-[20px] text-[16px] text-[#1A1A1A]`}>
                      {item.sessionVersion}
                    </td>
                    <td className={`${rowBg} rounded-r-[16px] px-[16px] py-[20px]`}>
                      <div className="flex flex-wrap gap-[8px]">
                        <button
                          type="button"
                          className={smallActionButtonClass}
                          disabled={isBusy}
                          onClick={() => openUserDetails(item.id)}
                        >
                          Подробнее
                        </button>
                        <button
                          type="button"
                          className={smallActionButtonClass}
                          disabled={isBusy}
                          onClick={() => openUserHistory(item.id)}
                        >
                          История платежей
                        </button>
                        <button
                          type="button"
                          className={smallActionButtonClass}
                          disabled={isBusy || item.role === "super_admin"}
                          onClick={() => setDeleteTarget(item)}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!isAdminUsersLoading && adminUsers.length === 0 && (
            <div className="py-[24px] text-center text-[#8D8D8D]">
              <p className={`${mainText} m-0`}>Пользователи пока не найдены.</p>
            </div>
          )}
          {isAdminUsersLoading && (
            <div className="py-[24px] text-center text-[#8D8D8D]">
              <p className={`${mainText} m-0`}>Загружаем пользователей...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[16px] lg:hidden">
          {isAdminUsersLoading ? (
            <div className="rounded-[16px] bg-white p-[24px] text-center text-[#8D8D8D]">
              <p className={`${mainText} m-0`}>Загружаем пользователей...</p>
            </div>
          ) : adminUsers.length === 0 ? (
            <div className="rounded-[16px] bg-white p-[24px] text-center text-[#8D8D8D]">
              <p className={`${mainText} m-0`}>Пользователи пока не найдены.</p>
            </div>
          ) : (
            adminUsers.map((item, index) => {
              const bg = index % 2 === 0 ? "bg-white" : "bg-[#F8F8F8]";
              const isBusy = activeActionUserId === item.id;
              return (
                <article
                  key={item.id}
                  className={`${bg} rounded-[16px] p-[24px] shadow-[0px_4px_25px_rgba(0,69,157,0.05)]`}
                >
                  <div className="flex flex-col gap-[16px]">
                    <div className="flex items-start justify-between gap-[16px]">
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">
                          {item.login || "—"}
                        </span>
                        <span className={`${mainText} text-[#8D8D8D]`}>{item.email || "—"}</span>
                      </div>
                      <span className={`${mainText} text-[#8D8D8D]`}>#{item.id}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-[8px]">
                      <span className={`${mainText} text-[#1A1A1A]`}>
                        Роль: <span className="text-[#8D8D8D]">{item.role}</span>
                      </span>
                      <span className={`${mainText} text-[#1A1A1A]`}>
                        Имя: <span className="text-[#8D8D8D]">{[item.firstName, item.surname].filter(Boolean).join(" ") || "—"}</span>
                      </span>
                      <span className={`${mainText} text-[#1A1A1A]`}>
                        Зарегистрирован: <span className="text-[#8D8D8D]">{formatDateTime(item.registeredAt)}</span>
                      </span>
                      <span className={`${mainText} text-[#1A1A1A]`}>
                        Последняя покупка: <span className="text-[#8D8D8D]">{formatDateTime(item.lastPurchaseAt)}</span>
                      </span>
                      <span className={`${mainText} text-[#1A1A1A]`}>
                        Устройства: <span className="text-[#8D8D8D]">{item.devicesCount}</span>
                      </span>
                      <span className={`${mainText} text-[#1A1A1A]`}>
                        Активные подписки: <span className="text-[#8D8D8D]">{item.activeSubscriptionsCount}</span>
                      </span>
                      <span className={`${mainText} text-[#1A1A1A]`}>
                        Активные коды: <span className="text-[#8D8D8D]">{item.activeCodesCount}</span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <button
                        type="button"
                        className={smallActionButtonClass}
                        disabled={isBusy}
                        onClick={() => openUserDetails(item.id)}
                      >
                        Подробнее
                      </button>
                      <button
                        type="button"
                        className={smallActionButtonClass}
                        disabled={isBusy}
                        onClick={() => openUserHistory(item.id)}
                      >
                        История платежей
                      </button>
                      <button
                        type="button"
                        className={smallActionButtonClass}
                        disabled={isBusy || item.role === "super_admin"}
                        onClick={() => setDeleteTarget(item)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      <BaseModal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setDetailData(null);
          setDetailError("");
        }}
        title="Данные пользователя"
        long
        panelClassName="!max-w-[980px]"
        titleClassName="md:text-left"
      >
        <div className="flex flex-1 min-h-0 flex-col">
          {detailLoading ? (
            <div className="flex flex-1 items-center justify-center py-[24px]">
              <p className={`${mainText} m-0 text-[#8D8D8D]`}>Загружаем данные пользователя...</p>
            </div>
          ) : detailError ? (
            <div className="rounded-[16px] bg-[#FFE3E3] p-[20px]">
              <p className={`${mainText} m-0 text-[#FF383C]`}>{detailError}</p>
            </div>
          ) : detailData ? (
            <div className="flex flex-1 min-h-0 flex-col gap-[24px] overflow-y-auto pb-[24px]">
              <div className="rounded-[16px] bg-[#F8F8F8] p-[24px]">
                <div className="mb-[16px] flex flex-col gap-[4px]">
                  <h3 className="m-0 text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">
                    {detailData.user.login || detailData.user.email || `Пользователь #${detailData.user.id}`}
                  </h3>
                  <p className={`${mainText} m-0 text-[#8D8D8D]`}>
                    Вы с нами {formatMembershipDuration(detailData.user.registeredAt)}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2">
                  {detailFields.map(([label, value]) => (
                    <div key={label} className="rounded-[12px] bg-white p-[16px]">
                      <p className={`${mainText} m-0 text-[#8D8D8D]`}>{label}</p>
                      <p className={`${mainText} mt-[8px] mb-0 text-[#1A1A1A]`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[16px] bg-[#F8F8F8] p-[24px]">
                <h3 className="m-0 mb-[16px] text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">
                  Устройства
                </h3>
                <div className="flex flex-col gap-[12px]">
                  {detailData.devices.length === 0 ? (
                    <p className={`${mainText} m-0 text-[#8D8D8D]`}>Устройств нет.</p>
                  ) : (
                    detailData.devices.map((device) => (
                      <div key={device.id} className="rounded-[12px] bg-white p-[16px]">
                        <div className="flex flex-col gap-[12px] md:flex-row md:items-start md:justify-between">
                          <p className={`${mainText} m-0 text-[#1A1A1A]`}>
                            {device.name || "Без названия"}
                          </p>
                          <button
                            type="button"
                            className={smallActionButtonClass}
                            disabled={deletingDeviceId === device.id}
                            onClick={() => handleDeleteUserDevice(device.id)}
                          >
                            {deletingDeviceId === device.id ? "Удаляем..." : "Удалить устройство"}
                          </button>
                        </div>
                        {!!device.displayName && device.defaultName && (
                          <p className={`${mainText} mt-[8px] mb-0 text-[#8D8D8D]`}>
                            Автоназвание: {device.defaultName}
                          </p>
                        )}
                        <p className={`${mainText} mt-[8px] mb-0 text-[#8D8D8D]`}>
                          Тип: {device.deviceType || "—"} | Добавлено: {formatDateTime(device.createdAt)} |
                          Активность: {formatDateTime(device.lastActiveAt)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[16px] bg-[#F8F8F8] p-[24px]">
                <h3 className="m-0 mb-[16px] text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">
                  Подписки
                </h3>
                <div className="flex flex-col gap-[12px]">
                  {detailData.subscriptions.length === 0 ? (
                    <p className={`${mainText} m-0 text-[#8D8D8D]`}>Подписок нет.</p>
                  ) : (
                    detailData.subscriptions.map((subscription) => (
                      <div key={subscription.dbId} className="rounded-[12px] bg-white p-[16px]">
                        <p className={`${mainText} m-0 font-bold text-[#1A1A1A]`}>
                          {getSubscriptionName(subscription.sportId)}
                        </p>
                        <p className={`${mainText} mt-[8px] mb-0 text-[#8D8D8D]`}>
                          {getPlanLabel(subscription.plan)} | {getMethodLabel(subscription.method)}
                        </p>
                        <p className={`${mainText} mt-[8px] mb-0 text-[#1A1A1A]`}>
                          С {formatDateTime(subscription.startedAt)} до {formatDateTime(subscription.expiresAt)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[16px] bg-[#F8F8F8] p-[24px]">
                <h3 className="m-0 mb-[16px] text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">
                  Активные коды
                </h3>
                <div className="flex flex-col gap-[12px]">
                  {detailData.codes.length === 0 ? (
                    <p className={`${mainText} m-0 text-[#8D8D8D]`}>Активных кодов нет.</p>
                  ) : (
                    detailData.codes.map((codeItem) => (
                      <div key={codeItem.id} className="rounded-[12px] bg-white p-[16px]">
                        <div className="flex flex-col gap-[8px] md:flex-row md:items-start md:justify-between">
                          <div className="flex flex-col gap-[8px]">
                            <p className="m-0 text-[24px] leading-[1.1] font-bold text-[#00459D]">
                              {codeItem.code}
                            </p>
                            <p className={`${mainText} m-0 text-[#1A1A1A]`}>
                              {getCodePurposeLabel(codeItem.purpose)}
                            </p>
                          </div>
                          <div className="text-left md:text-right">
                            <p className={`${mainText} m-0 text-[#8D8D8D]`}>
                              Создан: {formatDateTime(codeItem.createdAt)}
                            </p>
                            <p className={`${mainText} mt-[8px] mb-0 text-[#8D8D8D]`}>
                              Истекает: {formatDateTime(codeItem.expiresAt)}
                            </p>
                          </div>
                        </div>
                        <p className={`${mainText} mt-[8px] mb-0 text-[#1A1A1A]`}>
                          Почта: {codeItem.email || "—"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </BaseModal>

      <BaseModal
        isOpen={historyModalOpen}
        onClose={() => {
          setHistoryModalOpen(false);
          setHistoryData(null);
          setHistoryError("");
        }}
        title="История платежей"
        long
        panelClassName="!max-w-[550px]"
        titleClassName="mb-[16px] md:mb-[24px] md:text-left"
      >
        <div className="flex flex-1 min-h-0 flex-col">
          {historyLoading ? (
            <div className="flex flex-1 items-center justify-center py-[24px]">
              <p className={`${mainText} m-0 text-[#8D8D8D]`}>Загружаем историю...</p>
            </div>
          ) : historyError ? (
            <div className="rounded-[16px] bg-[#FFE3E3] p-[20px]">
              <p className={`${mainText} m-0 text-[#FF383C]`}>{historyError}</p>
            </div>
          ) : historyData ? (
            <div className="flex flex-1 min-h-0 flex-col">
              <div className="mb-[16px] flex shrink-0 items-center justify-between">
                <span className={`${mainText} lg:text-[24px] text-[#8D8D8D]`}>Вы с нами</span>
                <span className={`${mainText} lg:text-[24px] text-[#1A1A1A]`}>
                  {formatMembershipDuration(historyData.user.registeredAt)}
                </span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                {historyItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-[16px] py-[24px] text-center">
                    <p className={`${mainText} m-0 max-w-[290px] text-[#8D8D8D]`}>
                      У пользователя пока нет покупок
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-[16px] pb-[24px]">
                    {historyItems.map((item) => (
                      <div className="rounded-[16px] bg-[#F8F8F8] p-[24px]" key={item.id}>
                        <div className="flex flex-col gap-[16px]">
                          <div className="flex items-center justify-between gap-[16px] md:hidden">
                            <div className="text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">
                              {item.amount}
                            </div>
                            <div className="text-right text-[20px] leading-[1.25] font-bold text-[#8D8D8D]">
                              {item.subscriptionName}
                            </div>
                          </div>
                          <div className="hidden items-start justify-between gap-[16px] md:flex">
                            <div className="text-[20px] leading-[1.25] font-bold text-[#1A1A1A]">
                              {item.amount}
                            </div>
                            <div className={`${mainText} text-right text-[#1A1A1A]`}>{item.date}</div>
                          </div>
                          <div className="flex items-start justify-between gap-[16px] md:hidden">
                            <div className="flex flex-col gap-[4px]">
                              <span className={`${mainText} text-[#8D8D8D]`}>Куплено на</span>
                              <span className={`${mainText} text-[#1A1A1A]`}>{item.purchaseTerm}</span>
                            </div>
                            <div className="flex flex-col items-end gap-[4px] text-right">
                              <span className={`${mainText} text-[#8D8D8D]`}>Дата покупки</span>
                              <span className={`${mainText} text-[#1A1A1A]`}>{item.date}</span>
                            </div>
                          </div>
                          <div className="hidden items-start justify-between gap-[16px] md:flex">
                            <div className="flex items-start gap-[8px]">
                              <span className={`${mainText} text-[#8D8D8D]`}>Куплено на</span>
                              <span className={`${mainText} text-[#1A1A1A]`}>{item.purchaseTerm}</span>
                            </div>
                            <div className="text-right text-[20px] leading-[1.25] font-light text-[#8D8D8D]">
                              {item.subscriptionName}
                            </div>
                          </div>
                          <div className="flex flex-col gap-[4px] md:flex-row-reverse md:items-start md:justify-between md:gap-[16px]">
                            <span className={`${mainText} text-[#8D8D8D]`}>{item.methodLabel}</span>
                            <span className={`${mainText} text-[#1A1A1A]`}>{item.method}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Вы уверены, что хотите удалить пользователя?"
        panelClassName="w-full !max-w-[444px]"
        titleClassName="md:!mb-[16px]"
      >
        <p className={`${mainText} m-0 mb-[24px] text-center text-[#8D8D8D]`}>
          {deleteTarget
            ? `Будут удалены аккаунт ${deleteTarget.login || deleteTarget.email || `#${deleteTarget.id}`}, устройства, подписки, история и связанные коды.`
            : ""}
        </p>
        <div className="flex flex-col gap-[16px]">
          <button
            type="button"
            className={`${primaryModalButtonClass} w-full md:w-full`}
            onClick={handleDeleteUser}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Удаляем..." : "Удалить пользователя"}
          </button>
          <button
            type="button"
            className={`${secondButtonClass} w-full md:w-full`}
            onClick={() => setDeleteTarget(null)}
            disabled={deleteLoading}
          >
            Вернуться назад
          </button>
        </div>
      </BaseModal>
    </section>
  );
}
