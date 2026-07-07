-- Migration: Add SOTK (Struktur Organisasi dan Tata Kerja) Tables
-- Date: 2026-05-29
-- Purpose: Add tables for organizational chart management with parent-child hierarchy

-- Table: jabatan_sotk (Position/Jabatan with hierarchy)
CREATE TABLE IF NOT EXISTS `jabatan_sotk` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_jabatan` VARCHAR(255) NOT NULL,
  `pejabat_nama` VARCHAR(255) NOT NULL,
  `foto_url` LONGTEXT,
  `deskripsi` LONGTEXT,
  `parent_id` INT,
  `urutan` INT DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `jabatan_sotk`(`id`) ON DELETE SET NULL,
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_urutan` (`urutan`)
);

-- Table: dusun_sotk (Village sub-division with leaders)
CREATE TABLE IF NOT EXISTS `dusun_sotk` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_dusun` VARCHAR(255) NOT NULL,
  `kepala` VARCHAR(255) NOT NULL,
  `foto_kepala` LONGTEXT,
  `deskripsi` LONGTEXT,
  `urutan` INT DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_urutan` (`urutan`)
);

-- Idempotent seed for SOTK positions with parent-child hierarchy
-- Uses INSERT ... SELECT ... WHERE NOT EXISTS to avoid duplicates

-- Ensure Kepala Desa exists (no parent, Level 1)
INSERT INTO jabatan_sotk (nama_jabatan, pejabat_nama, deskripsi, parent_id, urutan)
SELECT 'Kepala Desa', 'Budi Santoso', 'Kepala Desa', NULL, 1
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM jabatan_sotk WHERE nama_jabatan = 'Kepala Desa' AND parent_id IS NULL);

-- Capture Kepala Desa id
SET @kepala_id = (SELECT id FROM jabatan_sotk WHERE nama_jabatan = 'Kepala Desa' AND parent_id IS NULL LIMIT 1);

-- Ensure Sekretaris Desa exists under Kepala Desa
INSERT INTO jabatan_sotk (nama_jabatan, pejabat_nama, deskripsi, parent_id, urutan)
SELECT 'Sekretaris Desa', 'Ahmad Wijaya', 'Sekretaris Desa', @kepala_id, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM jabatan_sotk WHERE nama_jabatan = 'Sekretaris Desa' AND parent_id = @kepala_id);

-- Capture Sekretaris id
SET @sekretaris_id = (SELECT id FROM jabatan_sotk WHERE nama_jabatan = 'Sekretaris Desa' LIMIT 1);

-- Kasi / Kaur examples under Sekretaris
INSERT INTO jabatan_sotk (nama_jabatan, pejabat_nama, deskripsi, parent_id, urutan)
SELECT 'Kasi Pemerintahan', 'Siti Rahmawati', 'Kepala seksi pemerintahan', @sekretaris_id, 1
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM jabatan_sotk WHERE nama_jabatan = 'Kasi Pemerintahan' AND parent_id = @sekretaris_id);

INSERT INTO jabatan_sotk (nama_jabatan, pejabat_nama, deskripsi, parent_id, urutan)
SELECT 'Kasi Kesejahteraan', 'Rudi Hariyanto', 'Kepala seksi kesejahteraan', @sekretaris_id, 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM jabatan_sotk WHERE nama_jabatan = 'Kasi Kesejahteraan' AND parent_id = @sekretaris_id);

INSERT INTO jabatan_sotk (nama_jabatan, pejabat_nama, deskripsi, parent_id, urutan)
SELECT 'Kaur Keuangan', 'Lina Susanti', 'Kaur Keuangan', @sekretaris_id, 3
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM jabatan_sotk WHERE nama_jabatan = 'Kaur Keuangan' AND parent_id = @sekretaris_id);

-- Ensure two sample dusun_sotk exist
INSERT INTO dusun_sotk (nama_dusun, kepala, deskripsi, urutan)
SELECT 'Dusun Krajan', 'Slamet', 'Dusun Krajan dengan luas wilayah sekitar 2 ha', 1
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM dusun_sotk WHERE nama_dusun = 'Dusun Krajan');

INSERT INTO dusun_sotk (nama_dusun, kepala, deskripsi, urutan)
SELECT 'Dusun Gondang', 'Rina', 'Dusun Gondang dengan luas wilayah sekitar 2.5 ha', 2
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM dusun_sotk WHERE nama_dusun = 'Dusun Gondang');

