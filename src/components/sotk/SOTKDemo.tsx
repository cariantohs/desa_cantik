import React from 'react';
import { OrganizationalChart } from './OrganizationalChart';
import type { SOTKNode } from './types';

/**
 * Demo component with sample data for testing
 */
export const SOTKDemo: React.FC = () => {
  // Sample data matching the expected hierarchy
  // Structure:
  // - Kepala Desa (top)
  // - Sekretaris Desa (below Kepala Desa)
  // - Kaur (below Sekretaris Desa)
  // - Kasi (same level as Kaur, but direct line from Kepala Desa)
  // - Kadus (bottom, direct line from Kepala Desa)
  const sampleNodes: SOTKNode[] = [
    // Level 1 - Kepala Desa
    {
      id: 1,
      nama: 'Budi Santoso',
      jabatan: 'Kepala Desa',
      foto: null,
      parent_id: null,
      urutan_tampil: 1,
      level: 1,
      status: 'active',
    },
    // Level 2 - Sekretaris Desa (reports to Kepala Desa)
    {
      id: 3,
      nama: 'Siti Aminah',
      jabatan: 'Sekretaris Desa',
      foto: null,
      parent_id: 1,
      urutan_tampil: 1,
      level: 2,
      status: 'active',
    },
    // Level 3 - Kaur (below Sekretaris Desa)
    {
      id: 7,
      nama: 'Fitri Handayani',
      jabatan: 'Kaur Umum',
      foto: null,
      parent_id: 3,
      urutan_tampil: 1,
      level: 3,
      status: 'active',
    },
    {
      id: 8,
      nama: 'Gunawan',
      jabatan: 'Kaur Keuangan',
      foto: null,
      parent_id: 3,
      urutan_tampil: 2,
      level: 3,
      status: 'active',
    },
    {
      id: 9,
      nama: 'Hesti Wulandari',
      jabatan: 'Kaur Perencanaan',
      foto: null,
      parent_id: 3,
      urutan_tampil: 3,
      level: 3,
      status: 'active',
    },
    // Level 3 - Kasi (same level as Kaur, but direct line from Kepala Desa)
    {
      id: 4,
      nama: 'Andi Pratama',
      jabatan: 'Kasi Pemerintahan',
      foto: null,
      parent_id: 1,
      urutan_tampil: 2,
      level: 3,
      status: 'active',
    },
    {
      id: 5,
      nama: 'Dewi Sartika',
      jabatan: 'Kasi Kesejahteraan',
      foto: null,
      parent_id: 1,
      urutan_tampil: 3,
      level: 3,
      status: 'active',
    },
    {
      id: 6,
      nama: 'Eko Prasetyo',
      jabatan: 'Kasi Pelayanan',
      foto: null,
      parent_id: 1,
      urutan_tampil: 4,
      level: 3,
      status: 'active',
    },
    // Level 3 - Kadus (bottom, direct line from Kepala Desa)
    {
      id: 10,
      nama: 'Joko Susilo',
      jabatan: 'Kadus I',
      foto: null,
      parent_id: 1,
      urutan_tampil: 5,
      level: 3,
      status: 'active',
    },
    {
      id: 11,
      nama: 'Kartini',
      jabatan: 'Kadus II',
      foto: null,
      parent_id: 1,
      urutan_tampil: 6,
      level: 3,
      status: 'active',
    },
    {
      id: 12,
      nama: 'Lukman Hakim',
      jabatan: 'Kadus III',
      foto: null,
      parent_id: 1,
      urutan_tampil: 7,
      level: 3,
      status: 'active',
    },
    {
      id: 13,
      nama: 'Maya Sari',
      jabatan: 'Kadus IV',
      foto: null,
      parent_id: 1,
      urutan_tampil: 8,
      level: 3,
      status: 'active',
    },
    {
      id: 14,
      nama: 'Nurul Hidayah',
      jabatan: 'Kadus V',
      foto: null,
      parent_id: 1,
      urutan_tampil: 9,
      level: 3,
      status: 'active',
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Demo SOTK - Organizational Chart
        </h1>
        <OrganizationalChart nodes={sampleNodes} />
      </div>
    </div>
  );
};