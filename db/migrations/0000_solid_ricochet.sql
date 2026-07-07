CREATE TABLE `apbdes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tahun` int NOT NULL,
	`pendapatan_total` decimal(15,2) DEFAULT '0',
	`belanja_total` decimal(15,2) DEFAULT '0',
	`pembiayaan_total` decimal(15,2) DEFAULT '0',
	`rincian_pendapatan` json,
	`rincian_belanja` json,
	`dokumen_url` text,
	`gambar_infografis` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `apbdes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `berita` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`judul` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`isi` text NOT NULL,
	`gambar_sampul` text,
	`kategori` enum('kabar_desa','pengumuman','berita') NOT NULL DEFAULT 'kabar_desa',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`tanggal_publish` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `berita_id` PRIMARY KEY(`id`),
	CONSTRAINT `berita_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `dokumen` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`judul` varchar(255) NOT NULL,
	`file_url` text NOT NULL,
	`deskripsi` text,
	`kategori` varchar(100),
	`urutan` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dokumen_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dusun` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`deskripsi` text,
	`kepala` varchar(255),
	`kontak` varchar(50),
	`urutan` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dusun_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `galeri` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`judul` varchar(255) NOT NULL,
	`gambar_url` text NOT NULL,
	`kategori` enum('kegiatan','infraastruktur','pariwisata','umkm','pertanian','infografis','lainnya') NOT NULL DEFAULT 'lainnya',
	`tanggal` timestamp DEFAULT (now()),
	`deskripsi` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `galeri_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jabatan_desa` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`pejabat` varchar(255) NOT NULL,
	`foto_url` text,
	`deskripsi` text,
	`urutan` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jabatan_desa_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `komoditas` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`jenis` enum('pertanian','peternakan','perikanan','perkebunan') NOT NULL DEFAULT 'pertanian',
	`deskripsi` text,
	`luas_lahan` decimal(10,2),
	`hasil_produksi` decimal(12,2),
	`satuan` varchar(50) DEFAULT 'kg',
	`foto_url` text,
	`urutan` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `komoditas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lembaga` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`jenis` enum('pemerintahan','bpd','pkk','karang_taruna','lpmd','lainnya') NOT NULL DEFAULT 'lainnya',
	`deskripsi` text,
	`foto_url` text,
	`ketua` varchar(255),
	`anggota` int DEFAULT 0,
	`urutan` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lembaga_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `panduan` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`judul` varchar(255) NOT NULL,
	`konten` text NOT NULL,
	`file_pdf` text,
	`kategori` varchar(100),
	`urutan` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `panduan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pengaduan` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`kontak` varchar(100) NOT NULL,
	`email` varchar(255),
	`pesan` text NOT NULL,
	`status` enum('baru','diproses','selesai','ditolak') NOT NULL DEFAULT 'baru',
	`respon` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pengaduan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profil_desa` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`kunci` varchar(100) NOT NULL,
	`nilai` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `profil_desa_id` PRIMARY KEY(`id`),
	CONSTRAINT `profil_desa_kunci_unique` UNIQUE(`kunci`)
);
--> statement-breakpoint
CREATE TABLE `running_text` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`teks` text NOT NULL,
	`warna` varchar(7) DEFAULT '#ffffff',
	`background_color` varchar(7) DEFAULT '#dc2626',
	`kecepatan` int DEFAULT 50,
	`aktif` int DEFAULT 1,
	`urutan` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `running_text_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `statistik_desa` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tahun` int NOT NULL,
	`total_penduduk` int DEFAULT 0,
	`total_kk` int DEFAULT 0,
	`total_laki_laki` int DEFAULT 0,
	`total_perempuan` int DEFAULT 0,
	`luas_wilayah` decimal(10,2) DEFAULT '0',
	`jumlah_dusun` int DEFAULT 0,
	`jumlah_rt` int DEFAULT 0,
	`jumlah_rw` int DEFAULT 0,
	`data_pendidikan` json,
	`data_angkatan_kerja` json,
	`data_usia` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `statistik_desa_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tema_website` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`status_desa` enum('desa','kelurahan') NOT NULL DEFAULT 'desa',
	`tema` enum('light','dark','custom') NOT NULL DEFAULT 'light',
	`warna_primer` varchar(7) DEFAULT '#065f46',
	`warna_skunder` varchar(7) DEFAULT '#f3f4f6',
	`warna_accent` varchar(7) DEFAULT '#dc2626',
	`background_image_1` text,
	`background_image_2` text,
	`background_image_3` text,
	`background_animation_speed` int DEFAULT 5,
	`logo_url` text,
	`logo_kecil_url` text,
	`running_text_aktif` int DEFAULT 1,
	`font_family` varchar(100) DEFAULT 'system-ui',
	`border_radius` enum('none','sm','md','lg','full') NOT NULL DEFAULT 'md',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tema_website_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `umkm` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`nama_produk` varchar(255) NOT NULL,
	`nama_usaha` varchar(255),
	`deskripsi` text,
	`foto_url` text,
	`link` text,
	`kategori` enum('makanan','minuman','kerajinan','fashion','pertanian','jasa','lainnya') NOT NULL DEFAULT 'lainnya',
	`pemilik` varchar(255),
	`kontak` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `umkm_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`unionId` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(320),
	`avatar` text,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`lastSignInAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_unionId_unique` UNIQUE(`unionId`)
);
