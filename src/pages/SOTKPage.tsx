import { useState, useEffect } from 'react';
import { OrganizationalChart, MobileOrgChart } from '../components/sotk';
import type { SOTKNode } from '../components/sotk';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Loader2, Users, AlertCircle } from 'lucide-react';

/**
 * SOTK (Struktur Organisasi Tata Kerja) Page
 * Displays the organizational structure of the village government
 */
export default function SOTKPage() {
  const [isMobile, setIsMobile] = useState(false);

  // Fetch SOTK data
  const { data: nodes, isLoading, error } = useQuery<SOTKNode[]>({
    queryKey: ['sotk'],
    queryFn: async () => {
      const response = await api.get('/api/sotk');
      return response.data;
    },
  });

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat struktur organisasi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-gray-600 mb-4">
            Terjadi kesalahan saat memuat struktur organisasi. Silakan coba lagi nanti.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <Users className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Struktur Organisasi Tata Kerja
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Bagan organisasi pemerintahan desa yang menampilkan hierarki jabatan
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Legend */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Keterangan:</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span>Tidak Aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">—</span>
              <span>Garis Hierarki</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        {nodes && nodes.length > 0 ? (
          isMobile ? (
            <MobileOrgChart nodes={nodes} />
          ) : (
            <OrganizationalChart nodes={nodes} />
          )
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Belum Ada Data Struktur Organisasi
            </h2>
            <p className="text-gray-500">
              Struktur organisasi belum diatur. Silakan tambahkan data jabatan terlebih dahulu.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Cara Menggunakan:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Geser (drag) untuk menggeser tampilan bagan</li>
            <li>• Scroll mouse untuk zoom in/out</li>
            <li>• Gunakan tombol di pojok kanan atas untuk kontrol zoom</li>
            <li>• Arahkan kursor ke kartu untuk melihat efek hover</li>
          </ul>
        </div>
      </main>
    </div>
  );
}