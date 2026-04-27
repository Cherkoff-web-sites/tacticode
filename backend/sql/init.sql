-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  login VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'user',
  surname VARCHAR(128),
  first_name VARCHAR(128),
  birth_date DATE,
  club VARCHAR(255),
  session_version INTEGER NOT NULL DEFAULT 1,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role VARCHAR(32) NOT NULL DEFAULT 'user';

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS surname VARCHAR(128);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(128);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS birth_date DATE;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS club VARCHAR(255);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 1;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS last_device_unlinked_at TIMESTAMPTZ;

ALTER TABLE users
  ALTER COLUMN registered_at SET DEFAULT NOW();

UPDATE users
SET registered_at = NOW()
WHERE registered_at IS NULL;

UPDATE users
SET role = 'user'
WHERE role IS NULL;

-- Auth codes for registration and password reset
CREATE TABLE IF NOT EXISTS auth_codes (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  purpose VARCHAR(32) NOT NULL, -- 'register' | 'reset' | 'change_login' | 'admin_login'
  login VARCHAR(64),
  password_hash VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ
);

ALTER TABLE auth_codes
  ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_key VARCHAR(128),
  device_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  device_type VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE devices
  ADD COLUMN IF NOT EXISTS device_key VARCHAR(128);

ALTER TABLE devices
  ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_devices_user_device_key
  ON devices(user_id, device_key)
  WHERE device_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_auth_codes_email_purpose ON auth_codes(email, purpose);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sport_id VARCHAR(64) NOT NULL,
  plan VARCHAR(16) NOT NULL,   -- 'month' | 'year'
  method VARCHAR(16) NOT NULL, -- 'card' | 'qr'
  started_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user_sport
  ON subscriptions(user_id, sport_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
  ON subscriptions(user_id);

-- Subscription activation history
CREATE TABLE IF NOT EXISTS subscription_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sport_id VARCHAR(64) NOT NULL,
  plan VARCHAR(16) NOT NULL,   -- 'month' | 'year'
  method VARCHAR(16) NOT NULL, -- 'card' | 'qr'
  amount_rub INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id
  ON subscription_history(user_id);


