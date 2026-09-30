/**
 * Человекочитаемое имя устройства приложения для ЛК.
 * Пример: "ПК · Windows", "Ноут · macOS", "Телефон · Android"
 */

const GENERIC_NAME_RE =
  /tacticode|ue5|unreal|client|app|application|desktop\s*app|mobile\s*app/i;

function pickOsLabel(rawOs, haystack) {
  const text = `${rawOs || ""} ${haystack || ""}`.toLowerCase();

  if (/windows|win32|win64|win\s*1[0-9]/i.test(text)) return "Windows";
  if (/mac\s*os|macos|osx|darwin|macintosh/i.test(text)) return "macOS";
  if (/android/i.test(text)) return "Android";
  if (/\bios\b|iphone|ipad/i.test(text)) return "iOS";
  if (/linux|ubuntu|debian|fedora/i.test(text)) return "Linux";
  return null;
}

function pickFormLabel(rawForm, deviceType, haystack) {
  const text = `${rawForm || ""} ${haystack || ""}`.toLowerCase();
  const type = String(deviceType || "").trim().toLowerCase();

  if (
    /laptop|notebook|ноут|macbook|surface\s*laptop|ultrabook/i.test(text) ||
    rawForm === "laptop" ||
    rawForm === "notebook"
  ) {
    return "Ноут";
  }

  if (/tablet|ipad|планшет/i.test(text) || type === "tablet") {
    return "Планшет";
  }

  if (
    /phone|mobile|iphone|android|телефон/i.test(text) ||
    type === "mobile" ||
    rawForm === "phone" ||
    rawForm === "mobile"
  ) {
    return "Телефон";
  }

  if (/pc|desktop|computer|пк|компьютер/i.test(text) || type === "desktop" || rawForm === "pc") {
    return "ПК";
  }

  return "Устройство";
}

function isGenericDeviceName(name) {
  const value = String(name || "").trim();
  if (!value) return true;
  if (GENERIC_NAME_RE.test(value) && value.length < 40) return true;
  if (/^ue5(\s+client)?$/i.test(value)) return true;
  if (/^tacticode(\s+ue5)?$/i.test(value)) return true;
  return false;
}

/**
 * @param {object} input
 * @param {string} [input.device_name]
 * @param {string} [input.device_type]
 * @param {string} [input.os]
 * @param {string} [input.form_factor] - pc | laptop | notebook | phone | mobile | tablet
 * @param {string} [input.platform]
 */
export function buildAppDeviceName(input = {}) {
  const rawName = String(input.device_name || "").trim();
  const deviceType = String(input.device_type || "").trim();
  const osRaw = String(input.os || input.platform || "").trim();
  const formRaw = String(input.form_factor || input.formFactor || "").trim().toLowerCase();

  const haystack = [rawName, osRaw, formRaw, deviceType].filter(Boolean).join(" ");
  const formLabel = pickFormLabel(formRaw, deviceType, haystack);
  const osLabel = pickOsLabel(osRaw, haystack);

  // Если клиент уже прислал нормальное русское имя — оставляем, но чистим мусор Tacticode/UE5.
  if (rawName && !isGenericDeviceName(rawName)) {
    const cleaned = rawName
      .replace(/\bTacticode\b/gi, "")
      .replace(/\bUE5\b/gi, "")
      .replace(/\bUnreal\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/^[·\-\s]+|[·\-\s]+$/g, "")
      .trim();

    if (cleaned && /[А-Яа-яЁё]/.test(cleaned)) {
      return cleaned.slice(0, 255);
    }

    // Английское "Windows PC" / "MacBook" → через нашу схему
    if (osLabel || formLabel !== "Устройство") {
      return osLabel ? `${formLabel} · ${osLabel}` : formLabel;
    }

    if (cleaned) return cleaned.slice(0, 255);
  }

  return osLabel ? `${formLabel} · ${osLabel}` : formLabel;
}

export function humanizeDeviceRow(row) {
  if (!row) return row;
  const nextName = buildAppDeviceName({
    device_name: row.device_name,
    device_type: row.device_type,
  });
  return {
    ...row,
    device_name: nextName,
  };
}
