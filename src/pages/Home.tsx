import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import BackgroundCarousel from "@/components/BackgroundCarousel";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MapPin,
  Building2,
  TrendingUp,
  Newspaper,
  ArrowRight,
  Calendar,
  Sprout,
  Store,
  Phone,
} from "lucide-react";

export default function Home() {
  const { data: profil } = trpc.desa.profil.list.useQuery();
  const { data: statistik } = trpc.desa.statistik.getLatest.useQuery();
  const { data: beritaList } = trpc.desa.berita.list.useQuery({
    status: "published",
    limit: 4,
  });
  const { data: lembagaList } = trpc.desa.lembaga.list.useQuery();
  const { data: galeriList } = trpc.desa.galeri.list.useQuery();
    const { data: umkmList } = trpc.desa.umkm.list.useQuery();

  const namaDesa = profil?.nama_desa || "Desa Cantik";
  const visi = profil?.visi || "";

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 text-white overflow-hidden">
        <BackgroundCarousel />
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              Website Resmi Pemerintah Desa
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Selamat Datang di<br />
              <span className="text-emerald-200">{namaDesa}</span>
            </h1>
            <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
              {visi}
            </p>
            {/* Quick actions (Profil Desa / Layanan Publik / Hubungi Kami) dihapus sesuai permintaan */}
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="-mt-10 relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Penduduk */}
          <Card className="relative overflow-hidden border border-white/60 bg-white/60 backdrop-blur shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/15 via-emerald-100/20 to-white/0" />
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-xl" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/35" />
            <CardContent className="relative p-5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-emerald-50/80 border border-emerald-100">
                  <Users className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                    {statistik?.totalPenduduk?.toLocaleString("id-ID") || "0"}
                  </p>
                  <p className="text-xs font-medium text-gray-600 mt-2">
                    Jiwa Penduduk
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Luas Wilayah */}
          <Card className="relative overflow-hidden border border-white/60 bg-white/60 backdrop-blur shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-blue-100/20 to-white/0" />
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-xl" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/35" />
            <CardContent className="relative p-5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-blue-50/80 border border-blue-100">
                  <MapPin className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                    {statistik?.luasWilayah || "0"}
                  </p>
                  <p className="text-xs font-medium text-gray-600 mt-2">
                    Ha Luas Wilayah
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kepala Keluarga */}
          <Card className="relative overflow-hidden border border-white/60 bg-white/60 backdrop-blur shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/15 via-orange-100/20 to-white/0" />
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-500/10 blur-xl" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/35" />
            <CardContent className="relative p-5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-orange-50/80 border border-orange-100">
                  <Building2 className="h-5 w-5 text-orange-700" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                    {statistik?.totalKK?.toLocaleString("id-ID") || "0"}
                  </p>
                  <p className="text-xs font-medium text-gray-600 mt-2">
                    Kepala Keluarga
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dusun */}
          <Card className="relative overflow-hidden border border-white/60 bg-white/60 backdrop-blur shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-purple-100/20 to-white/0" />
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-500/10 blur-xl" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/35" />
            <CardContent className="relative p-5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-purple-50/80 border border-purple-100">
                  <TrendingUp className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                    {statistik?.jumlahDusun || "0"}
                  </p>
                  <p className="text-xs font-medium text-gray-600 mt-2">
                    Dusun
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Berita (pengganti Layanan & Informasi) */}
      <section className="py-16 bg-gradient-to-b from-white via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Informasi dari Berita
              </h2>
              <p className="text-gray-500 mt-1">
                Kabar & pengumuman terbaru desa
              </p>
            </div>

            <Link to="/berita">
              <Button
                variant="outline"
                className="hidden sm:flex border-gray-200 bg-white/70 hover:bg-white"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {beritaList && beritaList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {beritaList.slice(0, 2).map((berita) => (
                  <Link key={berita.id} to={`/berita/${berita.slug}`}>
                    <Card className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer h-full overflow-hidden group">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={
                            berita.gambarSampul ||
                            "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800"
                          }
                          alt={berita.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              berita.kategori === "pengumuman"
                                ? "bg-orange-100 text-orange-700"
                                : berita.kategori === "berita"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {berita.kategori === "kabar_desa"
                              ? "Kabar Desa"
                              : berita.kategori === "pengumuman"
                                ? "Pengumuman"
                                : "Berita"}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white/90 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span className="text-[12px]">
                            {formatDate(berita.tanggalPublish)}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                          {berita.judul}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex sm:hidden">
                <Link to="/berita">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Lihat Semua
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-2">
              <Card className="border border-gray-200 bg-white/70 backdrop-blur shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <Newspaper className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Belum ada berita atau pengumuman
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Silakan tambahkan data berita/pengumuman melalui Admin supaya tampil di beranda.
                      </p>
                      <div className="mt-4">
                        <Link to="/berita">
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            Lihat semua Berita
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Latest News */}
      {beritaList && beritaList.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Berita & Pengumuman
                </h2>
                <p className="text-gray-500 mt-1">
                  Informasi terbaru dari desa
                </p>
              </div>
              <Link to="/berita">
                <Button variant="outline" className="hidden sm:flex">
                  Lihat Semua
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {beritaList.map((berita) => (
                <Link key={berita.id} to={`/berita/${berita.slug}`}>
                  <Card className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer h-full overflow-hidden group">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={
                          berita.gambarSampul ||
                          "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=400"
                        }
                        alt={berita.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            berita.kategori === "pengumuman"
                              ? "bg-orange-100 text-orange-700"
                              : berita.kategori === "berita"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {berita.kategori === "kabar_desa"
                            ? "Kabar Desa"
                            : berita.kategori === "pengumuman"
                              ? "Pengumuman"
                              : "Berita"}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(berita.tanggalPublish)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {berita.judul}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {galeriList && galeriList.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Galeri Desa</h2>
              <p className="text-gray-500 mt-1">Dokumentasi kegiatan desa</p>
            </div>
            <Link to="/transparansi/galeri">
              <Button variant="outline" className="hidden sm:flex">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {galeriList.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="relative group overflow-hidden rounded-xl aspect-[4/3]"
              >
                <img
                  src={item.gambarUrl}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-sm font-medium">
                    {item.judul}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* UMKM Preview */}
      {umkmList && umkmList.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  UMKM & Produk Lokal
                </h2>
                <p className="text-gray-500 mt-1">
                  Temukan produk unggulan desa
                </p>
              </div>
              <Link to="/potensi/umkm">
                <Button variant="outline" className="hidden sm:flex">
                  Lihat Semua
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {umkmList.map((item) => (
                <Card
                  key={item.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={
                        item.fotoUrl ||
                        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400"
                      }
                      alt={item.namaProduk}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium capitalize">
                      {item.kategori}
                    </span>
                    <h3 className="font-semibold text-sm text-gray-900 mt-2">
                      {item.namaProduk}
                    </h3>
                    {item.namaUsaha && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.namaUsaha}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lembaga */}
      {lembagaList && lembagaList.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Lembaga Kemasyarakatan
            </h2>
            <p className="text-gray-500 mt-1">
              Struktur organisasi kemasyarakatan desa
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lembagaList.slice(0, 3).map((item) => (
              <Card
                key={item.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {item.fotoUrl ? (
                      <img
                        src={item.fotoUrl}
                        alt={item.nama}
                        className="h-14 w-14 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                        <Users className="h-6 w-6 text-emerald-700" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">
                        {item.nama}
                      </h3>
                      {item.ketua && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ketua: {item.ketua}
                        </p>
                      )}
                      {item.anggota && (
                        <p className="text-xs text-gray-400 mt-1">
                          {item.anggota} anggota
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/pemerintahan/lembaga">
              <Button variant="outline">
                Lihat Semua Lembaga
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </Layout>
  );
}
