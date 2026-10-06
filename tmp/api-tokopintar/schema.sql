-- ============================================================
-- TokoPintar — skema database (Laragon / MySQL)
-- Satu baris per perangkat: JSON state (minat, keranjang, dll.)
-- ============================================================

CREATE DATABASE IF NOT EXISTS tokopintar
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tokopintar;

CREATE TABLE IF NOT EXISTS state_perangkat (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  device_id  CHAR(64)        NOT NULL,
  data_state JSON            NOT NULL,
  dibuat     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diubah     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_device (device_id)
) ENGINE = InnoDB;

-- Akun pengguna demo (tanpa password — prototipe kuliah)
CREATE TABLE IF NOT EXISTS pengguna (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nama       VARCHAR(80)  NOT NULL,
  email      VARCHAR(120) NOT NULL,
  dibuat     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
) ENGINE = InnoDB;
