import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import { useDesaStatus } from "@/hooks/useDesaStatus";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Users, Phone } from "lucide-react";

export default function DusunPage() {
  const { labels } = useDesaStatus();
  const { data: dusunList, isLoading } = trpc.desa.dusun.list.useQuery();

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold">
            {labels.namaWilayahPlural}
          </h1>
          <p className="text-emerald-100 mt-2">
            Daftar {labels.namaWilayahPlural} di {labels.statusDesa}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : dusunList && dusunList.length > 0 ? (
          <div className="space-y-4">
            {dusunList.map((dusun: any, index: number) => (
              <Card key={dusun.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 md:p-8 flex items-center justify-center min-w-[120px]">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{index + 1}</div>
                      <div className="text-sm opacity-80">{labels.namaWilayah}</div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                          {dusun.nama}
                        </h3>
                        {dusun.deskripsi && (
                          <p className="text-gray-600 mb-4">
                            {dusun.deskripsi}
                          </p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {dusun.kepala && (
                            <div className="flex items-start gap-2">
                              <Users className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
                              <div>
                                <p className="text-xs text-gray-500 uppercase">
                                  Kepala {labels.namaWilayah}
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {dusun.kepala}
                                </p>
                              </div>
                            </div>
                          )}
                          {dusun.kontak && (
                            <div className="flex items-start gap-2">
                              <Phone className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
                              <div>
                                <p className="text-xs text-gray-500 uppercase">
                                  Kontak
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {dusun.kontak}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Data {labels.namaWilayahPlural} belum tersedia
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        {dusunList && dusunList.length > 0 && (
          <Card className="border-0 shadow-sm mt-8 bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader>
              <CardTitle className="text-emerald-700">
                Informasi {labels.namaWilayahPlural}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {labels.statusDesa} ini terdiri dari <strong>{dusunList.length}</strong> {labels.namaWilayahPlural}. 
                Setiap {labels.namaWilayah} dipimpin oleh seorang kepala yang bertanggung jawab 
                atas pelayanan dan pembangunan di wilayahnya.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
