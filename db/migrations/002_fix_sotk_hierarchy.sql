-- Migration: Fix SOTK Hierarchy
-- This migration updates the parent_id values to create the correct organizational structure
-- Structure: Kepala Desa -> Sekretaris Desa -> Kaur
--                         -> Kasi (direct)
--                         -> Kadus (direct)

-- Step 1: Update Sekretaris Desa to report to Kepala Desa (parent_id = 1)
UPDATE jabatan_sotk 
SET parent_id = 1 
WHERE nama_jabatan LIKE '%Sekretaris Desa%';

-- Step 2: Update Kaur to report to Sekretaris Desa
UPDATE jabatan_sotk 
SET parent_id = (
    SELECT id FROM jabatan_sotk 
    WHERE nama_jabatan LIKE '%Sekretaris Desa%' 
    LIMIT 1
) 
WHERE nama_jabatan LIKE '%Kaur%';

-- Step 3: Update Kasi to report directly to Kepala Desa
UPDATE jabatan_sotk 
SET parent_id = 1 
WHERE nama_jabatan LIKE '%Kasi%';

-- Step 4: Update Kadus to report directly to Kepala Desa
UPDATE jabatan_sotk 
SET parent_id = 1 
WHERE nama_jabatan LIKE '%Kadus%' 
   OR nama_jabatan LIKE '%Kepala Dusun%';

-- Step 5: Update urutan_tampil to ensure proper ordering
-- Kepala Desa = 1, Sekretaris = 2, Kaur = 3-5, Kasi = 6-8, Kadus = 9-13
UPDATE jabatan_sotk SET urutan = 1 WHERE nama_jabatan LIKE '%Kepala Desa%';
UPDATE jabatan_sotk SET urutan = 2 WHERE nama_jabatan LIKE '%Sekretaris Desa%';

-- Set Kaur ordering (3, 4, 5)
SET @kaur_order = 3;
UPDATE jabatan_sotk 
SET urutan = (@kaur_order := @kaur_order + 1) 
WHERE nama_jabatan LIKE '%Kaur%' 
ORDER BY id;

-- Set Kasi ordering (6, 7, 8)
SET @kasi_order = 6;
UPDATE jabatan_sotk 
SET urutan = (@kasi_order := @kasi_order + 1) 
WHERE nama_jabatan LIKE '%Kasi%' 
ORDER BY id;

-- Set Kadus ordering (9-13)
SET @kadus_order = 9;
UPDATE jabatan_sotk 
SET urutan = (@kadus_order := @kadus_order + 1) 
WHERE nama_jabatan LIKE '%Kadus%' OR nama_jabatan LIKE '%Kepala Dusun%'
ORDER BY id;