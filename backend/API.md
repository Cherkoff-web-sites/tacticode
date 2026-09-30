# Tacticode Backend API

Краткое описание текущего backend API.

## Base

- Base URL (local): `http://localhost:4000`
- Base URL (prod): `https://tacticode.pro`
- Format: JSON
- Auth: JWT Bearer token

### Auth header

```http
Authorization: Bearer <accessToken>
```

### Optional device header

```http
X-Device-Id: <device_id>
```

Используется для обновления `last_active_at` текущего устройства и при некоторых операциях с сессией.

---

## Общая модель авторизации

1. Клиент логинится → получает `accessToken` (JWT).
2. Пароль сервер **не возвращает**.
3. Дальше все защищённые методы вызываются с `Authorization: Bearer ...`.
4. JWT живёт **24 часа**.
5. В токене есть `sessionVersion`. Если в БД `users.session_version` изменился — токен считается устаревшим (`401`).
6. Email/login сравниваются и сохраняются в **lower-case**.

### Сайт и приложение — независимые JWT

- Вход на **сайте** и вход в **UE5** выдают обычные JWT с текущим `session_version`.
- Регистрация устройства приложения **больше не увеличивает** `session_version`.
- Поэтому можно одновременно быть залогиненным в браузере и в приложении: вход на сайте **не выбивает** приложение и наоборот.
- `session_version` растёт только при чувствительных действиях (смена пароля, смена логина, сброс пароля) — тогда все старые JWT становятся невалидными.

### Устройства: только приложение

- В квоту и список ЛК попадают **только клиенты приложения** (`client = "app"`).
- Браузерные сессии **игнорируются**: сайт не регистрирует устройство; если вызвать register с `client: "web"`, сервер ответит `skipped: true` без записи в БД.
- Лимит app-устройств задаётся env **`MAX_DEVICES`** (`1` | `2` | `3`, по умолчанию `3`).
- Устройства различаются стабильным `device_key` (UUID инсталла UE5). Новый ключ сверх лимита → `409 DEVICE_LIMIT_REACHED`.

### Типичный объект `user`

```json
{
  "id": 1,
  "login": "user@mail.com",
  "email": "user@mail.com",
  "role": "user",
  "surname": "",
  "firstName": "",
  "birthDate": "1990-01-15",
  "club": "",
  "registeredAt": "2026-01-01T12:00:00.000Z",
  "createdAt": "2026-01-01T12:00:00.000Z",
  "updatedAt": "2026-01-01T12:00:00.000Z"
}
```

`role`: `user` | `super_admin`

---

## Health

### `GET /api/health`

Проверка живости сервиса.

- Response: `200` (без JSON body)

---

## Auth (`/api/auth`)

### `POST /api/auth/register`

Прямая регистрация (без кода).

Body:

```json
{
  "login": "user@mail.com",
  "email": "user@mail.com",
  "password": "secret"
}
```

Response `201`:

```json
{
  "user": { "...": "..." },
  "accessToken": "jwt..."
}
```

Errors:
- `400` логин/пароль обязательны
- `409` логин или почта заняты

---

### `POST /api/auth/register/request-code`

Запрос кода регистрации на почту.

Body:

```json
{
  "email": "user@mail.com",
  "password": "secret"
}
```

Response:

```json
{ "ok": true }
```

- код живёт **10 минут**
- Errors: `400`, `409`

---

### `POST /api/auth/register/confirm`

Подтверждение регистрации кодом.

Body:

```json
{
  "email": "user@mail.com",
  "code": "123456"
}
```

Response `201`:

```json
{
  "user": { "...": "..." },
  "accessToken": "jwt..."
}
```

Errors: `400`, `409`

---

### `POST /api/auth/login`

Вход обычного пользователя.

Body:

```json
{
  "identifier": "user@mail.com",
  "password": "secret"
}
```

`identifier` = login или email.

Response `200`:

```json
{
  "user": { "...": "..." },
  "accessToken": "jwt..."
}
```

Special cases:
- пользователь не найден → `404`
- пустой пароль → `400`
- неверный пароль → `401`
- если это `super_admin` → `403` с кодом:

```json
{
  "error": "Для супер-админа используйте вход по коду",
  "code": "SUPER_ADMIN_CODE_REQUIRED",
  "email": "admin@mail.com"
}
```

---

### `POST /api/auth/admin/request-code`

Запрос кода входа супер-админа.

Body:

```json
{ "email": "admin@mail.com" }
```

Response:

```json
{ "ok": true }
```

---

### `POST /api/auth/admin/confirm-code`

Подтверждение входа супер-админа.

Body:

```json
{
  "email": "admin@mail.com",
  "code": "123456"
}
```

Response:

```json
{
  "user": { "...": "..." },
  "accessToken": "jwt..."
}
```

---

### `POST /api/auth/password/request-reset`

Запрос кода сброса пароля.

Body:

```json
{
  "identifier": "user@mail.com"
}
```

или

```json
{
  "email": "user@mail.com"
}
```

Response:

```json
{
  "ok": true,
  "email": "user@mail.com"
}
```

---

### `POST /api/auth/password/verify-code`

Проверка кода сброса.

Body:

```json
{
  "email": "user@mail.com",
  "code": "123456"
}
```

Response:

```json
{ "ok": true }
```

---

### `POST /api/auth/password/reset`

Сброс пароля + выдача нового токена.

Body:

```json
{
  "email": "user@mail.com",
  "code": "123456",
  "password": "new-secret"
}
```

Response:

```json
{
  "user": { "...": "..." },
  "accessToken": "jwt..."
}
```

Дополнительно:
- `session_version += 1`
- другие устройства удаляются

---

### `GET /api/auth/me` 🔐

Текущий пользователь.

Response:

```json
{
  "user": { "...": "..." }
}
```

Подходит для проверки актуальности токена на клиенте.

---

### `PATCH /api/auth/me` 🔐

Обновление профиля.

Body (любые из полей):

```json
{
  "login": "new@mail.com",
  "email": "new@mail.com",
  "surname": "Иванов",
  "firstName": "Иван",
  "birthDate": "1990-01-15",
  "club": "Спартак"
}
```

- `birthDate` формат: `YYYY-MM-DD`
- Response: `{ "user": ... }`

---

### `PATCH /api/auth/me/password` 🔐

Смена пароля из ЛК.

Body:

```json
{ "password": "new-secret" }
```

Response:

```json
{
  "user": { "...": "..." },
  "accessToken": "jwt..."
}
```

Дополнительно:
- `session_version += 1`
- другие устройства удаляются (кроме текущего, если передан `X-Device-Id`)

---

### `POST /api/auth/me/request-login-change` 🔐

Запрос кода на смену логина/почты.

Body:

```json
{ "login": "new@mail.com" }
```

Response:

```json
{ "ok": true }
```

---

### `POST /api/auth/me/confirm-login-change` 🔐

Подтверждение смены логина/почты.

Body:

```json
{
  "login": "new@mail.com",
  "code": "123456"
}
```

Response:

```json
{
  "user": { "...": "..." },
  "accessToken": "jwt..."
}
```

Дополнительно:
- `session_version += 1`
- другие устройства удаляются

---

## Devices (`/api/devices`)

Все методы 🔐.

### Правила (актуально)

- в списке и квоте только устройства с `client = "app"` (UE5 / нативное приложение)
- браузер (`client: "web"` / `"browser"`) **не сохраняется** и **не влияет** на квоту и чужие JWT
- максимум app-устройств: env **`MAX_DEVICES`** = `1` | `2` | `3` (если не задано / некорректно → `3`)
- `POST /register` **не ротирует** `session_version` и **не возвращает** новый `accessToken`
- идентификация инсталла: стабильный `device_key` (один ПК / один билд = один ключ)
- удаление устройства: не чаще **1 раза в 10 минут**
- сайт больше не вызывает register при логине/регистрации
- в ответах devices всегда есть актуальное `maxDevices` из env

### `GET /api/devices`

Только app-устройства текущего пользователя.

Response:

```json
{
  "devices": [
    {
      "id": 10,
      "device_key": "uuid...",
      "device_name": "ПК · Windows",
      "display_name": "Домашний ПК",
      "device_type": "desktop",
      "client": "app",
      "created_at": "...",
      "last_active_at": "..."
    }
  ],
  "maxDevices": 3
}
```

`maxDevices` = текущий `MAX_DEVICES` из env (`1`–`3`).

---

### `POST /api/devices/register`

Регистрация/обновление **устройства приложения**.

При сохранении сервер сам нормализует `device_name` в русское читаемое имя
(например `ПК · Windows`, `Ноут · macOS`). Строки вроде `Tacticode UE5` / `UE5 Client` не показываются.

Body:

```json
{
  "device_key": "stable-uuid-on-client",
  "device_name": "UE5 Client",
  "device_type": "desktop",
  "client": "app",
  "os": "Windows",
  "form_factor": "laptop"
}
```

Required: `device_name`, `device_type`  
Optional:
- `device_key`
- `client` (`"app"` по умолчанию; `"web"` / `"browser"` → skip)
- `os` / `platform` — `Windows` | `macOS` | `Linux` | `Android` | `iOS` (или сырая строка)
- `form_factor` — `pc` | `laptop` | `notebook` | `phone` | `mobile` | `tablet`
- header `X-Device-Id`

Рекомендация для UE5 при первой авторизации:
- всегда `"client": "app"` + стабильный `device_key`
- передавать `os` (из FPlatform / GetOSVersion)
- по возможности `form_factor`: ноут vs ПК (например по наличию батареи) — иначе для `desktop` будет просто **«ПК»**

Примеры итогового `device_name` в ответе/ЛК:
- `ПК · Windows`
- `Ноут · macOS`
- `Телефон · Android`
- `ПК` (если ОС не передали)

Response `200/201` (app):

```json
{
  "device": { "...": "..." },
  "skipped": false,
  "maxDevices": 3
}
```

Response `200` (web, игнор):

```json
{
  "skipped": true,
  "reason": "web_client_ignored",
  "device": null,
  "maxDevices": 3
}
```

Error `409`:

```json
{
  "error": "Достигнут лимит устройств (3). Удалите одно из устройств в личном кабинете.",
  "maxDevices": 3,
  "code": "DEVICE_LIMIT_REACHED"
}
```
---

### `PATCH /api/devices/:id`

Переименование устройства.

Body:

```json
{
  "display_name": "Домашний ПК"
}
```

Response:

```json
{ "device": { "...": "..." } }
```

---

### `DELETE /api/devices/:id`

Удаление устройства.

Response:

```json
{ "ok": true }
```

Error `429`:

```json
{
  "error": "Отвязать устройство можно не чаще 1 раза в 10 минут.",
  "retryAt": "2026-08-20T12:00:00.000Z"
}
```

---

## Subscriptions (`/api/subscriptions`)

Все методы 🔐.

### Длительности подписок (тестовый режим)

- `plan=year` → **60 минут**
- `plan=month` → **7 минут**

### `GET /api/subscriptions`

Response:

```json
{
  "subscriptions": [
    {
      "dbId": 1,
      "id": "football",
      "sportId": "football",
      "plan": "month",
      "method": "card",
      "startedAt": "...",
      "expiresAt": "..."
    }
  ]
}
```

---

### `GET /api/subscriptions/history`

Response:

```json
{
  "history": [
    {
      "id": 1,
      "sportId": "football",
      "plan": "month",
      "method": "qr",
      "amountRub": 0,
      "startedAt": "...",
      "expiresAt": "...",
      "createdAt": "..."
    }
  ]
}
```

`method`: `card` | `qr`

---

### `POST /api/subscriptions/activate`

Активация/продление подписки.

Body:

```json
{
  "sportId": "football",
  "plan": "month",
  "method": "card"
}
```

Response:

```json
{
  "subscriptions": [ "..."],
  "history": ["..."]
}
```

---

## Admin (`/api/admin`)

Все методы требуют:
1. валидный JWT
2. `role = super_admin`
3. email/login супер-админа из конфига

### `GET /api/admin/users`

Список пользователей + метрики.

Response:

```json
{
  "users": [
    {
      "id": 1,
      "login": "...",
      "email": "...",
      "role": "user",
      "sessionVersion": 3,
      "devicesCount": 2,
      "activeSubscriptionsCount": 1,
      "historyCount": 4,
      "activeCodesCount": 0,
      "registeredAt": "...",
      "lastPurchaseAt": "...",
      "lastDeviceActiveAt": "...",
      "nearestCodeExpiresAt": null
    }
  ]
}
```

---

### `GET /api/admin/users/:id`

Детали пользователя.

Response:

```json
{
  "user": { "...": "..." },
  "devices": ["..."],
  "subscriptions": ["..."],
  "history": ["..."],
  "codes": ["..."]
}
```

---

### `DELETE /api/admin/users/:id/devices/:deviceId`

Удаление устройства пользователя админом.

Response:

```json
{ "ok": true }
```

---

### `DELETE /api/admin/users/:id`

Удаление пользователя (и связанных данных).

Ограничения:
- нельзя удалить себя
- нельзя удалить `super_admin`

Response:

```json
{ "ok": true }
```

---

## Типовые ошибки

```json
{ "error": "Текст ошибки" }
```

Частые коды:
- `400` невалидные данные
- `401` нет/битый/устаревший токен
- `403` нет прав
- `404` не найдено
- `409` конфликт (занято / лимит)
- `429` слишком часто
- `500` ошибка сервера
- `503` БД временно отключена (`DB_DISABLED=true`)

---

## Интеграция с UE5 (текущее состояние)

Сейчас для клиента доступны:
- `POST /api/auth/login`
- `GET /api/auth/me` — проверка токена
- `POST /api/devices/register` — только app (`client: "app"`), лимит из env `MAX_DEVICES` (1–3), без сброса JWT сайта
- `/api/subscriptions` — подписки (тест: month=7 мин, year=60 мин)

### Как различать 2 устройства

1. На каждом инсталле UE5 хранить свой стабильный `device_key` (UUID).
2. При логине/старте: `POST /api/devices/register` с этим ключом и `"client":"app"`.
3. Тот же ключ → обновление того же устройства (не занимает новый слот).
4. Новый ключ при уже 2 app-устройствах → `409` / `DEVICE_LIMIT_REACHED` (в UE5 уже есть экран).
5. Список слотов: `GET /api/devices`.

Вход на сайте **не** регистрирует устройство и **не** инвалидирует JWT приложения.

Отдельного API для схемы “вход через сайт по коду для UE5” пока нет.
Его нужно добавить отдельно (pairing / device-code flow).

---

## Примеры запросов

### Login

```bash
curl -X POST https://tacticode.pro/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"user@mail.com\",\"password\":\"secret\"}"
```

### Me

```bash
curl https://tacticode.pro/api/auth/me \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Register device

```bash
curl -X POST https://tacticode.pro/api/devices/register \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"device_key\":\"uuid-here\",\"device_name\":\"UE5 Client\",\"device_type\":\"desktop\",\"client\":\"app\",\"os\":\"Windows\",\"form_factor\":\"pc\"}"
```
