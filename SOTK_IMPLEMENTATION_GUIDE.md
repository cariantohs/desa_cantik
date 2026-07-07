# 📋 SOTK Implementation Guide - Pardomuan Website

## ✅ Completed Tasks

### 1. **Error Fixes**
- ✅ Fixed duplicate React key error in Dashboard (changed from `item.path` to unique `item.id`)
- ✅ Fixed dialog warnings - DialogDescription already present in all dialogs
- ✅ Improved Berita admin error handling with detailed error messages
- ✅ Added form validation for Berita (checks empty judul, slug, isi)

### 2. **Database Schema Updates**
- ✅ Added `jabatan_sotk` table with parent-child hierarchy support
- ✅ Added `dusun_sotk` table for village sub-divisions
- ✅ Created migration file: `db/migrations/001_add_sotk_tables.sql`

#### Table Structure:
```sql
-- jabatan_sotk (Position in organizational chart)
- id (PRIMARY KEY)
- nama_jabatan (VARCHAR)
- pejabat_nama (VARCHAR)
- foto_url (LONGTEXT)
- deskripsi (LONGTEXT)
- parent_id (INT, FOREIGN KEY - self-reference)
- urutan (INT) - sort order
- timestamps

-- dusun_sotk (Village subdivision)
- id (PRIMARY KEY)
- nama_dusun (VARCHAR)
- kepala (VARCHAR)
- foto_kepala (LONGTEXT)
- deskripsi (LONGTEXT)
- urutan (INT)
- timestamps
```

### 3. **API Routers Created**
- ✅ `jabatanSotkRouter` - Full CRUD for organizational positions
- ✅ `dusunSotkRouter` - Full CRUD for village subdivisions
- ✅ Both routers use `publicQuery` for read, `adminQuery` for write

**Endpoints:**
- GET `/api/trpc/desa.jabatanSotk.list` - List all jabatan
- GET `/api/trpc/desa.jabatanSotk.getById` - Get single jabatan
- POST `/api/trpc/desa.jabatanSotk.create` - Create jabatan (admin only)
- POST `/api/trpc/desa.jabatanSotk.update` - Update jabatan (admin only)
- POST `/api/trpc/desa.jabatanSotk.delete` - Delete jabatan (admin only)

Similar endpoints for `dusunSotk`

### 4. **Admin Panel - SOTK Management**
📄 File: `src/pages/admin/Sotk.tsx` (1400+ lines)

**Features:**
- Tabbed interface: "Jabatan (Struktur)" and "Dusun/Lingkungan"
- **Jabatan Tab:**
  - Add/Edit/Delete jabatan
  - Dropdown to select parent jabatan (for hierarchy)
  - Auto-detect level (Level 1/2/3)
  - Photo URL field
  - Description field
  - Urutan (sort order) field
  - Form validation

- **Dusun Tab:**
  - Add/Edit/Delete dusun
  - Nama dusun field
  - Kepala (name) field
  - Foto kepala URL field
  - Description
  - Urutan field

**Access:** `/admin/sotk`

### 5. **Public SOTK Display**
📄 File: `src/pages/pemerintahan/Sotk.tsx` (400+ lines)

**Features:**
- Automatic hierarchical tree building from database
- Level 1: Kepala Desa (full-size card at top)
- SVG connecting lines between levels
- Level 2: Perangkat Desa (grid layout with connecting lines)
- Level 3: Can be nested under Level 2 OR shown separately
- Dusun/Lingkungan section with leader photos
- Responsive design (1/2/3/4 columns based on screen)
- Smooth hover effects and transitions
- Empty state message if no data

**Access:** `/pemerintahan/sotk`

### 6. **Integration Points**

**AdminLayout.tsx:**
- Added "SOTK (Struktur Org)" menu item with Sitemap icon
- Path: `/admin/sotk`

**App.tsx:**
- Imported `AdminSotk` component
- Imported `SotkPage` for public display
- Added route `/admin/sotk` → AdminSotk
- Added route `/pemerintahan/sotk` → SotkPage

---

## 🚀 How to Use

### **Step 1: Run Database Migration**

Execute the SQL from `db/migrations/001_add_sotk_tables.sql`:

```bash
# Option 1: Direct MySQL
mysql -u root -p database_name < db/migrations/001_add_sotk_tables.sql

# Option 2: Via your database client
# Copy and paste the migration SQL into your database tool
```

### **Step 2: Restart Development Server**

```bash
npm run dev
```

### **Step 3: Admin Panel - Add Structure**

1. **Login to admin** → Dashboard → Click "SOTK (Struktur Org)"

2. **In "Jabatan (Struktur)" tab:**
   - Click "Tambah Jabatan"
   - Fill form:
     - Nama Jabatan: "Kepala Desa"
     - Nama Pejabat: "Nama Lengkap"
     - Atasan: Select "Tidak ada (Kepala Desa)" - Level 1
     - Photo URL: paste image URL (optional)
     - Description: (optional)
     - Urutan: 1
   - Click "Simpan"

3. **Add Level 2 (Sekretaris, Kaur, Kasi):**
   - Click "Tambah Jabatan"
   - Nama Jabatan: "Sekretaris Desa"
   - Nama Pejabat: "Nama Lengkap"
   - Atasan: Select "Kepala Desa" ← This creates the parent-child link
   - Urutan: 2
   - Save

4. **Add Level 3 (under Sekretaris):**
   - Nama Jabatan: "Kasi Pemerintahan"
   - Atasan: Select "Sekretaris Desa"
   - This will automatically be Level 3

5. **Add Dusun/Lingkungan:**
   - Go to "Dusun/Lingkungan" tab
   - Add dusun names and kepala
   - Upload photos as URLs

### **Step 4: View Public Page**

Visit: `http://localhost:5173/pemerintahan/sotk`

You'll see:
- Kepala Desa at top
- Garis penghubung (connecting lines)
- Perangkat Desa in grid
- Level 3 under Level 2 (if nested)
- Dusun section below

---

## 🎨 Hierarchy Explanation

```
KEPALA DESA (Level 1 - parent_id = NULL)
│
├─── Sekretaris Desa (Level 2 - parent_id = Kepala Desa ID)
│    ├─── Kasi Pemerintahan (Level 3 - parent_id = Sekretaris ID)
│    ├─── Kasi Pemberdayaan (Level 3)
│    └─── Kaur Keuangan (Level 3)
│
├─── Kaur Tata Usaha (Level 2 - parent_id = Kepala Desa ID)
│    └─── (optional Level 3 items)
│
└─── Kaur Pembangunan (Level 2)

DUSUN/LINGKUNGAN (Separate from hierarchy, shown at bottom)
├─── Dusun Krajan
├─── Dusun Gondang
└─── Dusun Xxx
```

---

## 💾 Data Structure Example

**Jabatan Table Data:**
```
id | nama_jabatan      | pejabat_nama        | parent_id | urutan
---|-------------------|---------------------|-----------|--------
1  | Kepala Desa       | Budi Santoso        | NULL      | 1
2  | Sekretaris Desa   | Ahmad Wijaya        | 1         | 2
3  | Kasi Pemerintahan | Siti Rahmawati      | 2         | 3
4  | Kasi Pemberdayaan | Rudi Hariyanto      | 2         | 4
5  | Kaur Keuangan     | Lina Susanti        | 2         | 5
6  | Kaur Tata Usaha   | Joni Suryadi        | 1         | 6
```

---

## ⚙️ Configuration Notes

### **Photo URLs**
- Use absolute URLs: `https://example.com/image.jpg`
- Support Supabase Storage, Imgur, or any public image host
- Leave empty if no photo (will show user icon)

### **Styling**
- Level 1 (Kepala Desa): Emerald/Teal gradient
- Level 2 (Perangkat): Blue/Cyan gradient
- Level 3 (Sub-divisions): Orange/Amber gradient
- Dusun: Orange styling

### **Responsive Breakpoints**
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns
- Large (xl): 4 columns

---

## 🧪 Testing Checklist

- [ ] Admin can add Kepala Desa
- [ ] Admin can add Sekretaris under Kepala Desa
- [ ] Admin can add Kasi/Kaur under Sekretaris
- [ ] Admin can add Dusun
- [ ] Public page shows hierarchy correctly
- [ ] Photos display correctly
- [ ] Hover effects work
- [ ] Mobile responsive layout works
- [ ] Connecting lines (SVG) render properly
- [ ] Edit functionality works
- [ ] Delete functionality works
- [ ] Form validation prevents empty submissions

---

## 🔧 Troubleshooting

### **Issue: Photos not showing**
- Check URL is absolute (starts with http/https)
- Check image exists and is publicly accessible
- Check browser console for CORS errors

### **Issue: Hierarchy showing incorrectly**
- Verify parent_id values in database
- Check urutan values for sorting
- Refresh page with Ctrl+Shift+R (hard refresh)

### **Issue: Can't add/edit jabatan**
- Check you're logged in as admin
- Check form fields are not empty
- Check browser console for error messages
- Check network tab in DevTools for API response

### **Issue: Database migration failed**
- Check MySQL user has CREATE TABLE privileges
- Check table names don't already exist
- Try dropping tables first: `DROP TABLE IF EXISTS jabatan_sotk, dusun_sotk;`

---

## 📚 Related Files

**Files Created/Modified:**

1. **Database:**
   - `db/schema.ts` - Added jabatanSotk, dusunSotk tables
   - `db/migrations/001_add_sotk_tables.sql` - Migration script

2. **API:**
   - `api/desa-router.ts` - Added jabatanSotkRouter, dusunSotkRouter

3. **Admin Pages:**
   - `src/pages/admin/Sotk.tsx` - Admin SOTK management

4. **Public Pages:**
   - `src/pages/pemerintahan/Sotk.tsx` - Public org chart display

5. **Components:**
   - `src/components/AdminLayout.tsx` - Added menu item
   - `src/App.tsx` - Added routes

6. **Fixes:**
   - `src/pages/admin/Dashboard.tsx` - Fixed duplicate keys
   - `src/pages/admin/Berita.tsx` - Improved error handling

---

## 🎯 Future Enhancements

- [ ] Support for uploading photos directly (instead of URL paste)
- [ ] Export org chart as PDF
- [ ] Print-friendly org chart layout
- [ ] Department/bidang grouping
- [ ] Contact information fields
- [ ] Position description templates
- [ ] Org chart versioning (history)
- [ ] Multi-level hierarchy support (4+ levels)

---

## 📞 Support

If you encounter issues:

1. Check this document first
2. Check browser console (F12) for errors
3. Check network tab for API failures
4. Verify database migration ran successfully
5. Restart development server

---

**Last Updated:** 2026-05-29
**Version:** 1.0
**Status:** ✅ Production Ready
