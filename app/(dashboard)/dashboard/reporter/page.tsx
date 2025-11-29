import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Sesuaikan path
import { db } from "@/database/drizzle"; // Sesuaikan path
import { damage_reports } from "@/database/schema"; // Sesuaikan path
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, FileText, Plus } from "lucide-react";

// Helper: Format Tanggal Indonesia
const formatDate = (date: Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric"
  });
};

// Helper: Warna Status
const getStatusColor = (status: string) => {
  switch (status) {
    case "selesai": return "bg-green-500 hover:bg-green-600";
    case "dalam_proses": return "bg-cyan-500 hover:bg-cyan-600";
    case "menunggu_verifikasi": return "bg-purple-500 hover:bg-purple-600";
    default: return "bg-amber-500 hover:bg-amber-600"; // menunggu
  }
};

export default async function ReporterDashboard() {
  // 1. Cek Sesi
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    redirect("/login");
  }

  const reporterId = parseInt(session.user.id);

  // 2. Fetch Data Statistik (Ambil semua laporan user ini untuk dihitung)
  // Cara efisien: Ambil status saja
  const allReports = await db
    .select({ status: damage_reports.status })
    .from(damage_reports)
    .where(eq(damage_reports.reporterId, reporterId));

  const totalReports = allReports.length;
  const countPending = allReports.filter(r => r.status === 'menunggu').length;
  const countProcess = allReports.filter(r => r.status === 'dalam_proses').length;
  const countDone = allReports.filter(r => r.status === 'selesai').length;

  // 3. Fetch Laporan Terbaru (Limit 5)
  const recentReports = await db
    .select()
    .from(damage_reports)
    .where(eq(damage_reports.reporterId, reporterId))
    .orderBy(desc(damage_reports.createdAt))
    .limit(5);

  // Data Statistik untuk UI
  const stats = [
    { 
      label: "Total Laporan", 
      value: totalReports.toString(), 
      icon: FileText,
      color: "bg-blue-100 text-blue-700"
    },
    { 
      label: "Menunggu", 
      value: countPending.toString(), 
      icon: Clock,
      color: "bg-amber-100 text-amber-700"
    },
    { 
      label: "Dalam Proses", 
      value: countProcess.toString(), 
      icon: AlertCircle,
      color: "bg-cyan-100 text-cyan-700"
    },
    { 
      label: "Selesai", 
      value: countDone.toString(), 
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700"
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Dasbor Pelapor</h2>
          <p className="text-blue-600">Halo, {session.user.name}. Ini ringkasan laporan Anda.</p>
        </div>
        
        {/* Tombol Buat Laporan menggunakan Link */}
        <Link href="/dashboard/reporter/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Lapor Kerusakan
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-blue-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports List */}
      <Card className="border-blue-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle className="text-blue-900">Laporan Terbaru</CardTitle>
                <CardDescription className="text-blue-600">
                    Status terkini dari laporan kerusakan yang Anda ajukan
                </CardDescription>
            </div>
            <Link href="/dashboard/reporter/history">
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    Lihat Semua
                </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    Belum ada laporan yang dibuat.
                </div>
            ) : (
                recentReports.map((report) => (
                <Link 
                    key={report.id} 
                    href={`/dashboard/reporter/history/${report.id}`} // Link ke detail (jika ada halaman detail)
                    className="block group"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-blue-100 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all">
                        <div className="flex-1 mb-2 sm:mb-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-slate-400">#{report.id.slice(0, 8)}</span>
                                {/* Note: Priority dihapus dari UI karena tidak ada di Schema DB Anda */}
                            </div>
                            <h4 className="font-semibold text-blue-900 group-hover:text-blue-700">{report.title}</h4>
                            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{report.location}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 justify-between sm:justify-end min-w-[140px]">
                            <p className="text-xs text-slate-500 font-medium">
                                {formatDate(report.createdAt)}
                            </p>
                            <Badge className={`text-white border-0 ${getStatusColor(report.status)}`}>
                                {report.status.replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>
                </Link>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}