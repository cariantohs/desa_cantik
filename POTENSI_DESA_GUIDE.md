# 📚 Panduan Implementasi Potensi Desa (Pariwisata, Pendidikan, Kesehatan, Ekonomi)

## 🎯 Ringkasan Fitur

Sistem Potensi Desa yang komprehensif dengan 4 submenu utama:

1. **Pariwisata** - Mengelola daftar penginapan/akomodasi wisata
2. **Pendidikan** - Mengelola sarana pendidikan dari PAUD hingga Perguruan Tinggi
3. **Kesehatan** - Mengelola sarana kesehatan (Puskesmas, Klinik, Apotek, dll)
4. **Ekonomi** - Mengelola sarana ekonomi (Pasar, Toko, Koperasi, Bank, Industri, dll)

---

## 🗄️ Database Schema

### 1. Tabel `pariwisata`
Menyimpan data penginapan dengan fitur:
- Foto multiple (slide gallery)
- Harga per malam atau satuan lain
- Rating bintang
- Kontak WhatsApp
- Fasilitas lengkap
- Koordinat lokasi (latitude/longitude)

```sql
CREATE TABLE pariwisata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  namaPenginapan VARCHAR(255) NOT NULL,
  alamat TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  deskripsi TEXT,
  fotoPenginapan JSON,  -- Array of URLs
  kontakWhatsapp VARCHAR(20),
  hargaMin DECIMAL(12,2),
  hargaMax DECIMAL(12,2),
  satuanHarga VARCHAR(50) DEFAULT 'per malam',
  fasilitas JSON,  -- Array of strings
  rating DECIMAL(3,2),
  urutan INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Tabel `pendidikan`
Menyimpan data sarana pendidikan dengan fitur:
- Jenjang pendidikan (PAUD-S3)
- Data kepala/pimpinan
- Jumlah guru dan siswa
- Status akreditasi
- Tahun berdiri
- Koordinat lokasi

```sql
CREATE TABLE pendidikan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  namaSarana VARCHAR(255) NOT NULL,
  jenjang ENUM('paud','tk','sd','smp','sma','smk','d1','d2','d3','d4','s1','s2','s3'),
  alamat TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  kepala VARCHAR(255),
  kontakNomor VARCHAR(20),
  kontakEmail VARCHAR(255),
  deskripsi TEXT,
  fotoUrl TEXT,
  jumlahGuru INT,
  jumlahSiswa INT,
  tahunBerdiri INT,
  statusAkreditasi VARCHAR(10),
  urutan INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Tabel `kesehatan`
Menyimpan data sarana kesehatan dengan fitur:
- Jenis sarana (Puskesmas, Klinik, Apotek, dll)
- Jam operasional
- Daftar layanan
- Data pimpinan
- Koordinat lokasi

```sql
CREATE TABLE kesehatan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  namaSarana VARCHAR(255) NOT NULL,
  jenis ENUM('puskesmas','poliklinik','rumah_sakit','apotek','klinik','posyandu','praktik_dokter','praktik_bidan'),
  alamat TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  pimpinan VARCHAR(255),
  kontakNomor VARCHAR(20),
  kontakEmail VARCHAR(255),
  deskripsi TEXT,
  fotoUrl TEXT,
  jamBuka VARCHAR(50),
  jamTutup VARCHAR(50),
  layanan JSON,  -- Array of strings
  urutan INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Tabel `ekonomi`
Menyimpan data sarana ekonomi dengan fitur:
- Jenis usaha (Pasar, Toko, Koperasi, Bank, Industri, dll)
- Jam operasional
- Daftar produk/barang
- Data pimpinan
- Koordinat lokasi

```sql
CREATE TABLE ekonomi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  namaSarana VARCHAR(255) NOT NULL,
  jenis ENUM('pasar','toko','koperasi','bank','bpr','lkm','bmt','unit_desa','industri_kecil','pertanian','perternakan','perikanan'),
  alamat TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  pimpinan VARCHAR(255),
  kontakNomor VARCHAR(20),
  kontakEmail VARCHAR(255),
  deskripsi TEXT,
  fotoUrl TEXT,
  jamBuka VARCHAR(50),
  jamTutup VARCHAR(50),
  produk JSON,  -- Array of strings
  urutan INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔧 API Routes

Semua fitur di-expose melalui tRPC routes dengan struktur:

### Pariwisata Routes
```typescript
desa.pariwisata.list()              // GET all
desa.pariwisata.getById({ id })     // GET by ID
desa.pariwisata.create({ ... })     // POST
desa.pariwisata.update({ id, ... }) // PUT
desa.pariwisata.delete({ id })      // DELETE
```

### Pendidikan Routes
```typescript
desa.pendidikan.list()                 // GET all
desa.pendidikan.getById({ id })        // GET by ID
desa.pendidikan.getByJenjang({ jenjang }) // Filter by level
desa.pendidikan.create({ ... })        // POST
desa.pendidikan.update({ id, ... })    // PUT
desa.pendidikan.delete({ id })         // DELETE
```

### Kesehatan Routes
```typescript
desa.kesehatan.list()              // GET all
desa.kesehatan.getById({ id })     // GET by ID
desa.kesehatan.getByJenis({ jenis }) // Filter by type
desa.kesehatan.create({ ... })     // POST
desa.kesehatan.update({ id, ... }) // PUT
desa.kesehatan.delete({ id })      // DELETE
```

### Ekonomi Routes
```typescript
desa.ekonomi.list()                // GET all
desa.ekonomi.getById({ id })       // GET by ID
desa.ekonomi.getByJenis({ jenis }) // Filter by type
desa.ekonomi.create({ ... })       // POST
desa.ekonomi.update({ id, ... })   // PUT
desa.ekonomi.delete({ id })        // DELETE
```

---

## 👨‍💼 Admin Pages

### Admin Pariwisata (`/src/pages/admin/Pariwisata.tsx`)
**Features:**
- Form input yang jelas dan terstruktur
- Multiple photo upload dengan preview
- Input untuk fasilitas (dinamis)
- WhatsApp integration (auto-format nomor)
- Harga range (min-max)
- Rating bintang
- Table view dengan aksi edit/delete
- Search & filter
- Responsive design

**UI Elements:**
- Header dengan gradient emerald-teal
- Dialog modal untuk form
- Card-based table layout
- Phone icon untuk WhatsApp
- Star icon untuk rating

### Admin Pendidikan (`/src/pages/admin/Pendidikan.tsx`)
**Features:**
- Dropdown untuk 13 jenjang pendidikan
- Input untuk data guru & siswa
- Status akreditasi (A, B, C, Belum)
- Tahun berdiri
- Foto URL dengan preview
- Kepala sekolah/universitas
- Kontak email & telepon
- Full CRUD dengan sorting by urutan
- Table dengan aksi edit/delete

**UI Elements:**
- Header dengan gradient blue-cyan
- Jenjang badges dengan color coding
- Icon-based table layout
- BookOpen icon untuk empty state

### Admin Kesehatan (`/src/pages/admin/Kesehatan.tsx`)
**Features:**
- Dropdown untuk 8 jenis sarana kesehatan
- Input jam buka-tutup
- Daftar layanan (dinamis)
- Foto URL dengan preview
- Pimpinan sarana
- Kontak email & telepon
- Full CRUD operations
- Table dengan aksi edit/delete

**UI Elements:**
- Header dengan gradient red-pink
- Jenis badges dengan color-coded pills
- Heart icon untuk empty state
- Time input untuk jam operasional

### Admin Ekonomi (`/src/pages/admin/Ekonomi.tsx`)
**Features:**
- Dropdown untuk 12 jenis usaha/sarana ekonomi
- Input jam buka-tutup
- Daftar produk/barang (dinamis)
- Foto URL dengan preview
- Pimpinan usaha
- Kontak email & telepon
- Full CRUD operations
- Table dengan aksi edit/delete

**UI Elements:**
- Header dengan gradient amber-yellow
- Jenis badges dengan color-coded pills
- TrendingUp icon untuk empty state
- Time input untuk jam operasional

---

## 🌐 Public Pages

### Pariwisata (`/src/pages/potensi/Pariwisata.tsx`)
**Features:**
- Photo gallery slider dengan Swiper
- List sidebar dengan search
- Detail view dengan harga range
- Fasilitas display
- WhatsApp contact button
- Responsive grid layout
- Search by nama atau lokasi
- Rating display dengan star

**Design:**
- Gradient hero (emerald-teal-cyan)
- Card-based layout
- Interactive selection
- Image carousel with navigation

### Pendidikan (`/src/pages/potensi/Pendidikan.tsx`)
**Features:**
- Tab view per jenjang pendidikan
- Group by jenjang otomatis
- Search functionality
- Filter by jenjang
- Card display dengan:
  - Foto sekolah
  - Info guru/siswa
  - Tahun berdiri
  - Status akreditasi
  - Kontak buttons
- Responsive grid

**Design:**
- Gradient hero (blue-cyan-blue)
- Tab navigation dengan badge count
- Card-based layout 2 columns
- Color-coded badges

### Kesehatan (`/src/pages/potensi/Kesehatan.tsx`)
**Features:**
- Filter by jenis sarana
- Search functionality
- Card display dengan:
  - Foto sarana
  - Jenis/tipe
  - Jam operasional
  - Daftar layanan preview
  - Kontak buttons
- Responsive grid

**Design:**
- Gradient hero (red-pink-red)
- Filter buttons dengan active state
- Card-based layout 3 columns
- Color-coded jenis badges
- Heart icon untuk branding

### Ekonomi (`/src/pages/potensi/Ekonomi.tsx`)
**Features:**
- Filter by jenis usaha
- Search functionality
- Card display dengan:
  - Foto sarana
  - Jenis usaha
  - Jam operasional
  - Daftar produk preview
  - Kontak buttons
- Responsive grid

**Design:**
- Gradient hero (amber-yellow-orange)
- Filter buttons dengan active state
- Card-based layout 3 columns
- Color-coded jenis badges
- TrendingUp icon untuk branding

---

## 📋 Routing Configuration

Tambahkan routes berikut di `src/App.tsx`:

### Public Routes
```typescript
<Route path="/potensi/pariwisata" element={<PariwisataPage />} />
<Route path="/potensi/pendidikan" element={<PendidikanPage />} />
<Route path="/potensi/kesehatan" element={<KesehatanPage />} />
<Route path="/potensi/ekonomi" element={<EkonomiPage />} />
```

### Admin Routes
```typescript
<Route path="/admin/pariwisata" element={<AdminPariwisata />} />
<Route path="/admin/pendidikan" element={<AdminPendidikan />} />
<Route path="/admin/kesehatan" element={<AdminKesehatan />} />
<Route path="/admin/ekonomi" element={<AdminEkonomi />} />
```

---

## 🚀 Setup Instructions

### 1. Database Migration
```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Or use push (untuk development)
npm run db:push
```

### 2. Update Navigation Menu

Tambahkan menu items di AdminLayout:
```typescript
{
  icon: MapPin,
  label: "Potensi Desa",
  submenu: [
    { label: "Pariwisata", href: "/admin/pariwisata" },
    { label: "Pendidikan", href: "/admin/pendidikan" },
    { label: "Kesehatan", href: "/admin/kesehatan" },
    { label: "Ekonomi", href: "/admin/ekonomi" }
  ]
}
```

### 3. Navbar Pengunjung
Tambahkan link di navbar public:
```typescript
{
  label: "Potensi Desa",
  submenu: [
    { label: "Pariwisata", href: "/potensi/pariwisata" },
    { label: "Pendidikan", href: "/potensi/pendidikan" },
    { label: "Kesehatan", href: "/potensi/kesehatan" },
    { label: "Ekonomi", href: "/potensi/ekonomi" }
  ]
}
```

---

## 💡 Fitur-Fitur Unggulan

### Pariwisata
✅ Multiple photo slider gallery  
✅ WhatsApp direct contact  
✅ Rating system  
✅ Price range  
✅ Fasilitas lengkap  
✅ Location map (lat/long)  

### Pendidikan
✅ 13 jenjang pendidikan  
✅ Akreditasi status  
✅ Data guru & siswa  
✅ Tahun berdiri  
✅ Kontak email & telepon  

### Kesehatan
✅ 8 jenis sarana kesehatan  
✅ Jam operasional  
✅ Daftar layanan  
✅ Kontak langsung  
✅ Foto dokumentasi  

### Ekonomi
✅ 12 jenis usaha/sarana  
✅ Jam operasional  
✅ Daftar produk  
✅ Filter by jenis  
✅ Kontak pemilik  

---

## 🎨 Design Highlights

| Fitur | Header Gradient | Primary Color | Icon |
|-------|---|---|---|
| Pariwisata | Emerald→Teal→Cyan | Emerald-700 | Map Pin |
| Pendidikan | Blue→Cyan→Blue | Blue-700 | Book Open |
| Kesehatan | Red→Pink→Red | Red-700 | Heart |
| Ekonomi | Amber→Yellow→Orange | Amber-700 | Trending Up |

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimized
- ✅ Desktop enhanced
- ✅ Touch-friendly buttons
- ✅ Readable typography
- ✅ Fast loading images

---

## 🔍 Admin User Experience

### Kemudahan Input Data:
1. **Section-based form**: Form dibagi menjadi bagian logis
2. **Clear labels**: Setiap field punya label yang jelas
3. **Validation**: Input validation untuk data integrity
4. **Dynamic inputs**: Array fields seperti foto & fasilitas
5. **Smart defaults**: Default values untuk quick input
6. **Toast notifications**: Feedback untuk setiap aksi

### Data Management:
- Search functionality
- Sort by urutan (order)
- Inline edit/delete
- Batch operations ready
- Export-ready structure

---

## 🛠️ Maintenance & Updates

### Adding New Field
1. Update database schema
2. Update Zod validation di API
3. Update form di admin page
4. Update display di public page
5. Run migration

### Adding New Category
1. Update ENUM di schema
2. Add new option di dropdown
3. Update label mapping
4. Update color mapping (jika ada)

---

## ✅ Testing Checklist

- [ ] Database migrations berhasil
- [ ] API endpoints accessible
- [ ] Admin form dapat submit
- [ ] Data tersimpan di database
- [ ] Public pages menampilkan data
- [ ] Search/filter berfungsi
- [ ] WhatsApp link works (pariwisata)
- [ ] Photo gallery slide (pariwisata)
- [ ] Responsive di mobile
- [ ] Email/phone links work
- [ ] Navigation menu updated

---

## 📞 Support & Troubleshooting

**Migration Error?**
```bash
# Reset dan ulangi
npm run db:reset
npm run db:push
```

**API Not Found?**
- Restart server
- Check router.ts imports
- Verify route registration

**Form Not Working?**
- Check browser console untuk errors
- Verify API endpoint
- Check network tab untuk requests

**Images Not Showing?**
- Verify image URL format
- Check CORS settings
- Use absolute URLs

---

Generated: 2026-06-09
Version: 1.0
