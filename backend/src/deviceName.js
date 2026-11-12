/**
 * Имя устройства приложения для ЛК — ровно то, что прислал UE5 в device_name.
 */

export function buildAppDeviceName(input = {}) {
  const rawName = String(input.device_name || "").trim();
  return rawName ? rawName.slice(0, 255) : "Устройство";
}

export function humanizeDeviceRow(row) {
  return row;
}
