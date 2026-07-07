# ✅ Potensi Desa - Setup Checklist

**Project:** Pardomuan Village Website  
**Feature:** Potensi Desa dengan 4 Submenu  
**Date:** 2026-06-09

---

## 📋 Pre-Deployment Checklist

### 1️⃣ Database Setup
- [ ] Backup database sebelum migration
- [ ] Run `npm run db:generate`
- [ ] Review generated migration files
- [ ] Run `npm run db:push`
- [ ] Verify 4 tabel baru di database:
  - [ ] `pariwisata`
  - [ ] `pendidikan`
  - [ ] `kesehatan`
  - [ ] `ekonomi`
- [ ] Test database connection

### 2️⃣ Backend Setup
- [ ] Verify `db/schema.ts` has 4 new exports
- [ ] Verify `api/desa-router.ts` has 4 new routers
- [ ] Check router imports di `api/router.ts`
- [ ] Restart development server: `npm run dev`
- [ ] Test API endpoints in Postman/Insomnia:
  - [ ] GET /api/desa/pariwisata/list
  - [ ] GET /api/desa/pendidikan/list
  - [ ] GET /api/desa/kesehatan/list
  - [ ] GET /api/desa/ekonomi/list

### 3️⃣ Frontend Routes
- [ ] Verify imports in `src/App.tsx`:
  - [ ] PariwisataPage
  - [ ] PendidikanPage
  - [ ] KesehatanPage
  - [ ] EkonomiPage
  - [ ] AdminPariwisata
  - [ ] AdminPendidikan
  - [ ] AdminKesehatan
  - [ ] AdminEkonomi
- [ ] Verify public routes:
  - [ ] `/potensi/pariwisata`
  - [ ] `/potensi/pendidikan`
  - [ ] `/potensi/kesehatan`
  - [ ] `/potensi/ekonomi`
- [ ] Verify admin routes:
  - [ ] `/admin/pariwisata`
  - [ ] `/admin/pendidikan`
  - [ ] `/admin/kesehatan`
  - [ ] `/admin/ekonomi`

### 4️⃣ Admin Interface
- [ ] Update `src/components/AdminLayout.tsx`:
  - [ ] Add "Potensi Desa" menu item dengan icon
  - [ ] Add 4 submenu items dengan correct hrefs
  - [ ] Add icon imports (MapPin atau landmark)
- [ ] Verify menu appears in admin
- [ ] Click each menu item → navigate correctly
- [ ] Test form loading:
  - [ ] `/admin/pariwisata` form loads
  - [ ] `/admin/pendidikan` form loads
  - [ ] `/admin/kesehatan` form loads
  - [ ] `/admin/ekonomi` form loads

### 5️⃣ Admin Data Entry Testing
#### Pariwisata
- [ ] Fill form dengan data dummy:
  - [ ] Nama Penginapan: "Homestay Maju Jaya"
  - [ ] Alamat: "Jl. Desa No. 1"
  - [ ] Harga Min/Max: 100000 - 500000
  - [ ] WhatsApp: +62812345678
  - [ ] Fasilitas: WiFi, AC, Kolam
  - [ ] Foto: Add min 1 URL
- [ ] Submit form
- [ ] Verify success toast
- [ ] Check data di table
- [ ] Test edit & delete

#### Pendidikan
- [ ] Fill form dengan data dummy:
  - [ ] Nama: "SD Negeri Desa"
  - [ ] Jenjang: "sd"
  - [ ] Alamat: "Jl. Pendidikan No. 1"
  - [ ] Kepala: "Ibu Siti"
  - [ ] Guru: 30
  - [ ] Siswa: 500
  - [ ] Akreditasi: "A"
- [ ] Submit form
- [ ] Check data di table
- [ ] Test edit & delete

#### Kesehatan
- [ ] Fill form dengan data dummy:
  - [ ] Nama: "Puskesmas Desa"
  - [ ] Jenis: "puskesmas"
  - [ ] Alamat: "Jl. Kesehatan No. 1"
  - [ ] Jam Buka: 08:00
  - [ ] Jam Tutup: 17:00
  - [ ] Layanan: Pemeriksaan Umum
  - [ ] Kontak: +628123456789
- [ ] Submit form
- [ ] Check data di table
- [ ] Test edit & delete

#### Ekonomi
- [ ] Fill form dengan data dummy:
  - [ ] Nama: "Pasar Tradisional"
  - [ ] Jenis: "pasar"
  - [ ] Alamat: "Jl. Perdagangan No. 1"
  - [ ] Jam Buka: 06:00
  - [ ] Jam Tutup: 18:00
  - [ ] Produk: Beras, Telur
  - [ ] Kontak: +628123456789
- [ ] Submit form
- [ ] Check data di table
- [ ] Test edit & delete

### 6️⃣ Public Pages Testing
#### Pariwisata Page
- [ ] Navigate ke `/potensi/pariwisata`
- [ ] Page loads correctly
- [ ] Hero section displays
- [ ] Data dari database muncul
- [ ] Search works
- [ ] Click item → detail view
- [ ] Photo carousel works (jika ada foto)
- [ ] WhatsApp button clickable

#### Pendidikan Page
- [ ] Navigate ke `/potensi/pendidikan`
- [ ] Page loads correctly
- [ ] Tabs by jenjang muncul
- [ ] Data grouped correctly
- [ ] Search works
- [ ] Contact buttons clickable

#### Kesehatan Page
- [ ] Navigate ke `/potensi/kesehatan`
- [ ] Page loads correctly
- [ ] Filter buttons muncul
- [ ] Filter functionality works
- [ ] Cards display correctly
- [ ] Contact buttons clickable

#### Ekonomi Page
- [ ] Navigate ke `/potensi/ekonomi`
- [ ] Page loads correctly
- [ ] Filter buttons muncul
- [ ] Filter functionality works
- [ ] Cards display correctly
- [ ] Contact buttons clickable

### 7️⃣ Navigation & Menu
- [ ] Update navbar public untuk add Potensi Desa menu
- [ ] Test navbar links:
  - [ ] /potensi/pariwisata accessible
  - [ ] /potensi/pendidikan accessible
  - [ ] /potensi/kesehatan accessible
  - [ ] /potensi/ekonomi accessible
- [ ] Admin menu appears & clickable
- [ ] Menu styling matches theme

### 8️⃣ Responsive Design
- [ ] Test di desktop (1920px)
  - [ ] Admin form layout correct
  - [ ] Table displays all columns
  - [ ] Public pages look good
- [ ] Test di tablet (768px)
  - [ ] Form responsive
  - [ ] Table scrolls properly
  - [ ] Cards grid adjust
- [ ] Test di mobile (375px)
  - [ ] Form stacked vertically
  - [ ] Cards single column
  - [ ] Buttons clickable
  - [ ] Images load properly

### 9️⃣ Data Persistence
- [ ] Add data di admin
- [ ] Close browser
- [ ] Reopen website
- [ ] Check public pages
- [ ] Data still there ✓
- [ ] Test refresh page
- [ ] Data persists ✓

### 🔟 Error Handling
- [ ] Test submit empty form
  - [ ] Validation error appears ✓
- [ ] Test invalid email
  - [ ] Error message shows ✓
- [ ] Test delete
  - [ ] Confirmation needed ✓
- [ ] Test network error
  - [ ] Graceful error handling ✓

---

## 📝 Documentation Checklist

- [ ] `POTENSI_DESA_GUIDE.md` created & complete
- [ ] `POTENSI_IMPLEMENTATION_SUMMARY.md` created
- [ ] README.md updated (optional)
- [ ] Code comments added (if needed)
- [ ] Database schema documented

---

## 🎨 Visual Checklist

- [ ] Pariwisata design (emerald gradient)
- [ ] Pendidikan design (blue gradient)
- [ ] Kesehatan design (red gradient)
- [ ] Ekonomi design (amber gradient)
- [ ] All cards render properly
- [ ] All buttons have hover state
- [ ] All icons display correctly
- [ ] Typography looks good

---

## 🚀 Deployment Checklist

### Before Going Live
- [ ] All tests passed
- [ ] No console errors
- [ ] No 404 errors
- [ ] All links work
- [ ] Contact integration tested
- [ ] Database backed up
- [ ] Performance checked

### Production Settings
- [ ] Environment variables correct
- [ ] API endpoints correct
- [ ] Database credentials secure
- [ ] SSL certificate valid
- [ ] CORS settings appropriate

---

## 📱 Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## ⚡ Performance Checklist

- [ ] Page load time < 3s
- [ ] Images optimized
- [ ] No console warnings
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Responsive scrolling

---

## 🔒 Security Checklist

- [ ] Admin routes protected
- [ ] Input validation on server
- [ ] SQL injection prevented
- [ ] XSS protection enabled
- [ ] CSRF tokens (if needed)
- [ ] Password hashed (if applicable)

---

## 📊 Post-Launch Monitoring

**First Week:**
- [ ] Monitor server logs
- [ ] Check error rates
- [ ] Monitor database performance
- [ ] Check user feedback
- [ ] Fix critical bugs immediately

**Monthly:**
- [ ] Backup database
- [ ] Review analytics
- [ ] Update content as needed
- [ ] Check broken links
- [ ] Test all features

---

## 📞 Troubleshooting Quick Guide

### Database Not Found
```bash
# Check if tables exist
SELECT TABLE_NAME FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'your_db' 
AND TABLE_NAME IN ('pariwisata', 'pendidikan', 'kesehatan', 'ekonomi');

# If not, re-run migration
npm run db:push
```

### API Endpoints 404
```bash
# Restart server
npm run dev

# Check router.ts imports
# Verify endpoints in api/desa-router.ts
```

### Form Not Submitting
- Check browser console for errors
- Verify API endpoint is correct
- Check network tab
- Verify input validation

### Images Not Showing
- Verify image URL format
- Check image exists at URL
- Try different image
- Check CORS settings

---

## ✅ Sign-Off

**Pre-Launch Review:**
- [ ] All items checked
- [ ] No critical issues
- [ ] Ready for production
- [ ] Team approved

**Date:** ______________  
**Checked By:** ______________  
**Approved By:** ______________

---

## 📌 Notes

```
Add any notes or special instructions here:




```

---

**Last Updated:** 2026-06-09  
**Checklist Version:** 1.0
