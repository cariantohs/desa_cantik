# SOTK - Struktur Organisasi Tata Kerja

Modul SOTK yang telah di-redesign total untuk menampilkan bagan organisasi pemerintahan desa yang profesional, modern, dan elegan.

## Fitur Utama

### 1. **Tampilan Hierarki Profesional**
- Struktur organisasi yang jelas dengan garis konektor SVG yang halus
- Ukuran kartu berbeda berdasarkan level jabatan
- Layout simetris dan seimbang

### 2. **Kartu Jabatan Modern**
- Foto profil dengan placeholder otomatis
- Informasi jabatan dan nama yang jelas
- Indikator status aktif/tidak aktif
- Efek hover yang elegan

### 3. **Interaktivitas Lengkap**
- Zoom in/out dengan mouse wheel
- Pan/drag untuk menggeser tampilan
- Tombol kontrol zoom
- Auto-fit to screen

### 4. **Responsive Design**
- Desktop: Organizational chart penuh dengan zoom/pan
- Mobile: Vertical tree view yang collapsible
- Tablet: Adaptif sesuai ukuran layar

### 5. **Kinerja Optimal**
- Render rekursif yang efisien
- SVG connectors yang ringan
- Support untuk jumlah node besar

## Struktur Komponen

```
src/components/sotk/
├── types.ts                    # TypeScript definitions
├── utils/
│   └── treeBuilder.ts         # Tree building algorithm
├── SVGConnectors.tsx          # SVG connector lines
├── OrgChartCard.tsx           # Card component
├── MobileOrgChart.tsx         # Mobile view
├── OrganizationalChart.tsx    # Main chart component
├── SOTKDemo.tsx               # Demo component
├── index.ts                   # Exports
└── README.md                  # Documentation
```

## Cara Penggunaan

### 1. Import Komponen

```tsx
import { OrganizationalChart, MobileOrgChart } from '../components/sotk';
import type { SOTKNode } from '../components/sotk';
```

### 2. Siapkan Data

```tsx
const nodes: SOTKNode[] = [
  {
    id: 1,
    nama: 'Kepala Desa',
    jabatan: 'Kepala Desa',
    foto: 'url_foto',
    parent_id: null,
    urutan_tampil: 1,
    level: 1,
    status: 'active',
  },
  // ... more nodes
];
```

### 3. Render Komponen

```tsx
// Desktop view
<OrganizationalChart nodes={nodes} />

// Mobile view
<MobileOrgChart nodes={nodes} />
```

## Algoritma Tree Building

### 1. **Membangun Tree dari Flat Data**

```typescript
function buildTree(flatNodes: SOTKNode[]): TreeNode[]
```

- Membuat map dari semua node
- Menghubungkan parent-child berdasarkan `parent_id`
- Mengurutkan children berdasarkan `urutan_tampil`
- Menghitung depth untuk setiap node

### 2. **Menghitung Posisi**

```typescript
function calculatePositions(roots: TreeNode[], config: LayoutConfig): TreeNode[]
```

- Menghitung lebar subtree untuk setiap node
- Menempatkan node secara horizontal
- Menjaga jarak yang konsisten antar node
- Menghindari overlap

### 3. **Menggambar Konektor**

```typescript
<SVGRoundedConnectors
  roots={treeData}
  nodeWidth={160}
  nodeHeight={200}
  strokeWidth={2}
  strokeColor="#CBD5E1"
/>
```

- Menggunakan bezier curves untuk garis yang halus
- Membuat branching structure untuk multiple children
- Rounded corners untuk tampilan yang lebih modern

## Hierarki Default

Berdasarkan analisis jabatan:

- **Level 1**: Kepala Desa, BPD
- **Level 2**: Sekretaris Desa
- **Level 3**: Kasi, Kaur
- **Level 4**: Kadus (Kepala Dusun)

## Styling

### Warna
- Primary: `#0F766E` (Teal)
- Secondary: `#14B8A6` (Light Teal)
- Background: `#F8FAFC` (Light Gray)
- Card: `#FFFFFF` (White)
- Border: `#E2E8F0` (Light Border)
- Line: `#CBD5E1` (Connector Line)
- Text: `#0F172A` (Dark Text)

### Ukuran Kartu
- Level 1: 192px × 224px
- Level 2: 176px × 208px
- Level 3: 160px × 192px
- Level 4: 144px × 176px

## Tips Performa

1. **Gunakan Pagination** untuk data yang sangat besar (>100 nodes)
2. **Lazy Load** foto profil untuk mengurangi initial load time
3. **Memoize** perhitungan tree jika data tidak sering berubah
4. **Virtual Scrolling** untuk mobile view dengan banyak node

## Troubleshooting

### Garis Konektor Tidak Muncul
- Pastikan `parent_id` diatur dengan benar
- Periksa apakah node memiliki children
- Verifikasi dimensi container cukup besar

### Kartu Overlap
- Tingkatkan `horizontalSpacing` atau `verticalSpacing`
- Periksa apakah `urutan_tampil` sudah benar
- Pastikan tidak ada circular reference di `parent_id`

### Tampilan Mobile Tidak Responsif
- Pastikan breakpoint di `MobileOrgChart` sesuai
- Periksa apakah container memiliki width yang cukup
- Verifikasi CSS tidak conflict dengan style lain

## Development

### Menambahkan Fitur Baru

1. Buat komponen baru di folder `sotk/`
2. Tambahkan tests di `__tests__/`
3. Update dokumentasi ini
4. Export di `index.ts`

### Testing dengan Data Dummy

Gunakan komponen `SOTKDemo` untuk testing:

```tsx
import { SOTKDemo } from '../components/sotk';

function App() {
  return <SOTKDemo />;
}
```

## Kontribusi

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details.