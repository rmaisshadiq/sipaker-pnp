import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default async function LandingPage() {
  // 1. Cek User Session di Server (Cepat & Aman)
  const session = await getServerSession(authOptions);

  // 2. Logika Redirect Otomatis
  if (session?.user) {
    // Jika user punya role, arahkan ke dashboard spesifik
    if (session.user.role) {
      redirect(`/dashboard/${session.user.role}`);
    } else {
      // Fallback jika role tidak terbaca
      redirect("/dashboard");
    }
  }

  // 3. Jika belum login, tampilkan Landing Page
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col">
      {/* Navbar Sederhana */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Zap size={20} fill="currentColor" />
          </div>
          SIPAKER
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button>Masuk / Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
          Sistem Pelaporan Terpadu Politeknik Negeri Padang
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Lapor Kerusakan Fasilitas <br/>
          <span className="text-blue-600">Lebih Cepat & Mudah</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Wujudkan lingkungan kampus yang nyaman dengan melaporkan kerusakan fasilitas secara real-time. Pantau status perbaikan langsung dari perangkat Anda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
              Buat Laporan Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
              Pelajari Cara Kerja
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-blue-600" />}
            title="Laporan Real-time"
            desc="Kirim laporan kerusakan lengkap dengan foto dan lokasi hanya dalam hitungan detik."
          />
          <FeatureCard 
            icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
            title="Pantau Progres"
            desc="Dapatkan notifikasi status perbaikan dari teknisi secara transparan dan akurat."
          />
          <FeatureCard 
            icon={<ShieldCheck className="h-6 w-6 text-purple-600" />}
            title="Data Terintegrasi"
            desc="Semua data tersimpan aman dan terpusat untuk memudahkan pengelolaan inventaris kampus."
          />
        </div>
      </main>

      {/* Footer Sederhana */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-100">
        <p>© {new Date().getFullYear()} SIPAKER - Politeknik Negeri Padang. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Komponen Kecil untuk Card Fitur
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}