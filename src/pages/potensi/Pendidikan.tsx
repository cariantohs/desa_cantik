import { useState, useMemo } from "react";
import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Phone,
  Mail,
  Users,
  Award,
  Calendar,
  BookOpen,
} from "lucide-react";

const jenjangLabels: Record<string, string> = {
  paud: "PAUD",
  tk: "TK",
  sd: "SD",
  smp: "SMP",
  sma: "SMA",
  smk: "SMK",
  d1: "Diploma I",
  d2: "Diploma II",
  d3: "Diploma III",
  d4: "Diploma IV",
  s1: "Sarjana (S1)",
  s2: "Magister (S2)",
  s3: "Doktor (S3)",
};

const jenjangOrder = [
  "paud",
  "tk",
  "sd",
  "smp",
  "sma",
  "smk",
  "d1",
  "d2",
  "d3",
  "d4",
  "s1",
  "s2",
  "s3",
];

export default function PendidikanPage() {
  const { data: pendidikanList } = trpc.desa.pendidikan.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeJenjang, setActiveJenjang] = useState("sd");

  const grouped = useMemo(() => {
    if (!pendidikanList) return {};

    const result: Record<string, any[]> = {};
    jenjangOrder.forEach((jenjang) => {
      result[jenjang] = [];
    });

    pendidikanList.forEach((item) => {
      if (result[item.jenjang]) {
        result[item.jenjang].push(item);
      }
    });

    return result;
  }, [pendidikanList]);

  const filtered = useMemo(() => {
    const items = grouped[activeJenjang] || [];
    return items.filter(
      (item) =>
        item.namaSarana.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alamat.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [grouped, activeJenjang, searchQuery]);

  const akreditasiColor: Record<string, string> = {
    A: "bg-green-100 text-green-800",
    B: "bg-yellow-100 text-yellow-800",
    C: "bg-orange-100 text-orange-800",
    Belum: "bg-gray-100 text-gray-800",
  };

  const hasAnyData = Object.values(grouped).some((items) => items.length > 0);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 via-cyan-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pendidikan</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Jelajahi berbagai sarana pendidikan di desa kami, dari PAUD hingga
            Perguruan Tinggi. Kami berkomitmen untuk memberikan akses pendidikan
            berkualitas bagi semua generasi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {hasAnyData ? (
          <>
            {/* Search */}
            <div className="mb-8">
              <Input
                type="text"
                placeholder="Cari sarana pendidikan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-700 focus:outline-none"
              />
            </div>

            {/* Tabs untuk Jenjang */}
            <Tabs value={activeJenjang} onValueChange={setActiveJenjang}>
              <TabsList className="w-full grid grid-cols-7 md:grid-cols-13 gap-1 mb-8 bg-white border border-gray-200 p-2 rounded-lg h-auto">
                {jenjangOrder
                  .filter((j) => (grouped[j] || []).length > 0)
                  .map((jenjang) => (
                    <TabsTrigger
                      key={jenjang}
                      value={jenjang}
                      className="text-xs md:text-sm data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                    >
                      {jenjangLabels[jenjang]}
                    </TabsTrigger>
                  ))}
              </TabsList>

              {jenjangOrder
                .filter((j) => (grouped[j] || []).length > 0)
                .map((jenjang) => (
                  <TabsContent key={jenjang} value={jenjang} className="space-y-6">
                    {filtered.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filtered.map((item) => (
                          <Card
                            key={item.id}
                            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                          >
                            <CardContent className="p-0">
                              {/* Image */}
                              {item.fotoUrl ? (
                                <img
                                  src={item.fotoUrl}
                                  alt={item.namaSarana}
                                  className="w-full h-48 object-cover"
                                />
                              ) : (
                                <div className="w-full h-48 bg-blue-100 flex items-center justify-center">
                                  <BookOpen className="w-16 h-16 text-blue-300" />
                                </div>
                              )}

                              {/* Content */}
                              <div className="p-6 space-y-4">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {item.namaSarana}
                                  </h3>
                                  <div className="flex items-start gap-2 text-gray-600 text-sm">
                                    <MapPin className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                    <span>{item.alamat}</span>
                                  </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
                                  {item.jumlahGuru && (
                                    <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4 text-blue-600" />
                                      <div className="text-sm">
                                        <p className="text-gray-600">Guru</p>
                                        <p className="font-semibold text-gray-900">
                                          {item.jumlahGuru}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {item.jumlahSiswa && (
                                    <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4 text-cyan-600" />
                                      <div className="text-sm">
                                        <p className="text-gray-600">Siswa</p>
                                        <p className="font-semibold text-gray-900">
                                          {item.jumlahSiswa}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {item.tahunBerdiri && (
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-amber-600" />
                                      <div className="text-sm">
                                        <p className="text-gray-600">Berdiri</p>
                                        <p className="font-semibold text-gray-900">
                                          {item.tahunBerdiri}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {item.statusAkreditasi && (
                                    <div className="flex items-center gap-2">
                                      <Award className="w-4 h-4 text-emerald-600" />
                                      <div className="text-sm">
                                        <p className="text-gray-600">Akreditasi</p>
                                        <p className="font-semibold text-gray-900">
                                          {item.statusAkreditasi}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Deskripsi */}
                                {item.deskripsi && (
                                  <p className="text-gray-700 text-sm line-clamp-2">
                                    {item.deskripsi}
                                  </p>
                                )}

                                {/* Kontak */}
                                <div className="space-y-2">
                                  {item.kepala && (
                                    <p className="text-sm text-gray-600">
                                      <span className="font-semibold">Kepala:</span>{" "}
                                      {item.kepala}
                                    </p>
                                  )}
                                  <div className="flex gap-3 pt-2">
                                    {item.kontakNomor && (
                                      <a
                                        href={`tel:${item.kontakNomor}`}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                      >
                                        <Phone className="w-4 h-4" />
                                        Hubungi
                                      </a>
                                    )}
                                    {item.kontakEmail && (
                                      <a
                                        href={`mailto:${item.kontakEmail}`}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                      >
                                        <Mail className="w-4 h-4" />
                                        Email
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-0 shadow-lg">
                        <CardContent className="text-center py-12">
                          <p className="text-gray-500">
                            Tidak ada sarana pendidikan pada jenjang ini
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                ))}
            </Tabs>
          </>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Belum ada data sarana pendidikan
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
