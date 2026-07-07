# SOTK Hierarchy Implementation Guide

## Overview
This document explains the organizational hierarchy structure for the SOTK (Susunan Organisasi dan Tata Kerja) implementation.

## Hierarchy Structure

The SOTK chart follows this specific hierarchy:

```
Level 0 (Top):
├── Kepala Desa (Village Head)
└── Ketua BPD (Head of Village Consultative Body)

Level 1:
└── Sekretaris Desa (Village Secretary) - Reports to Kepala Desa

Level 2 (Same Level - All report to Kepala Desa):
├── Kaur (Kepala Urusan) - Reports through Sekretaris Desa
│   ├── Kaur Umum
│   ├── Kaur Keuangan
│   └── Kaur Perencanaan
├── Kasi (Kepala Seksi) - Direct line from Kepala Desa
│   ├── Kasi Pemerintahan
│   ├── Kasi Kesejahteraan
│   └── Kasi Pelayanan
└── Kadus (Kepala Dusun) - Direct line from Kepala Desa
    ├── Kadus I
    ├── Kadus II
    ├── Kadus III
    ├── Kadus IV
    └── Kadus V
```

## Key Implementation Details

### 1. Visual Level Assignment (treeBuilder.ts)

The `getVisualLevel()` function determines the vertical position based on jabatan:

- **Level 0**: Kepala Desa, BPD
- **Level 1**: Sekretaris Desa
- **Level 2**: Kaur, Kasi, Kadus (all on same visual level)

### 2. Parent-Child Relationships (SOTKDemo.tsx)

- **Kepala Desa** (parent_id: null) - Root node
- **Sekretaris Desa** (parent_id: 1) - Child of Kepala Desa
- **Kaur** (parent_id: 3) - Children of Sekretaris Desa
- **Kasi** (parent_id: 1) - Direct children of Kepala Desa
- **Kadus** (parent_id: 1) - Direct children of Kepala Desa

### 3. Positioning Algorithm (treeBuilder.ts)

The `calculatePositions()` function:
1. Groups nodes by their visual level (not tree depth)
2. Sorts nodes within each level by `urutan_tampil`
3. Positions nodes horizontally centered within each level
4. Ensures proper vertical spacing between levels

### 4. Card Sizing (OrganizationalChart.tsx & OrgChartCard.tsx)

- **Level 1** (Kepala Desa/BPD): Largest cards (w-48, h-56)
- **Level 2** (Sekretaris Desa): Medium-large cards (w-44, h-52)
- **Level 3** (Kasi/Kaur): Medium cards (w-40, h-48)
- **Level 4** (Kadus): Smallest cards (w-36, h-44)

### 5. Connector Lines (SVGConnectors.tsx)

The `SVGRoundedConnectors` component:
- Draws smooth, rounded connector lines
- Handles single child (direct vertical line)
- Handles multiple children (branching structure)
- Uses bezier curves for smooth transitions

## Database Schema

The SOTK data is stored with these key fields:

```sql
CREATE TABLE sotk (
  id INTEGER PRIMARY KEY,
  nama VARCHAR(255),
  jabatan VARCHAR(255),
  foto VARCHAR(500),
  parent_id INTEGER, -- References parent node (null for root)
  urutan_tampil INTEGER, -- Display order within same level
  level INTEGER, -- Hierarchical level (1-4)
  status VARCHAR(20) -- 'active' or 'inactive'
);
```

## Usage

### Viewing the Demo
Access the demo at: `/sotk-demo`

### Production Page
Access the production SOTK page at: `/sotk`

### API Endpoints
- `GET /api/sotk` - Get all active SOTK nodes
- `GET /api/sotk/tree` - Get SOTK data as a tree structure

## Customization

To modify the hierarchy:

1. **Change visual levels**: Edit `getVisualLevel()` in `treeBuilder.ts`
2. **Adjust spacing**: Modify config in `OrganizationalChart.tsx`
3. **Change card sizes**: Update sizeConfig in `OrgChartCard.tsx`
4. **Modify connector style**: Edit `SVGConnectors.tsx`

## Troubleshooting

If the chart doesn't display correctly:

1. Verify `parent_id` values are correct
2. Check `urutan_tampil` for proper ordering
3. Ensure all nodes have unique IDs
4. Confirm `status` is set to 'active'
5. Check browser console for errors

## Professional Features

- **Zoom & Pan**: Mouse wheel to zoom, drag to pan
- **Responsive**: Adapts to screen size
- **Hover Effects**: Cards highlight on hover
- **Status Indicators**: Green/gray dots show active/inactive status
- **Professional Styling**: Clean, modern design with proper spacing