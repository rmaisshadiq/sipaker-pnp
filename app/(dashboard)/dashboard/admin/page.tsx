import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Sesuaikan path
import { db } from "@/database/drizzle"; // Sesuaikan path
import { damage_reports, maintenance_reports, users } from "@/database/schema"; // Sesuaikan path
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, FileText, Users, Wrench, Activity } from "lucide-react";

// Helper untuk format waktu relatif (misal: "2 jam lalu")
const timeAgo = (date: Date | null) => {
  if (!date) return "-";
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit lalu";
  return Math.floor(seconds) + " detik lalu";
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  // 1. Cek Akses Admin
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  // 2. FETCH DATA PARALEL (Agar Cepat)
  const [allDamageReports, allMaintenanceTasks, allTechnicians] = await Promise.all([
    // Ambil semua laporan kerusakan (status)
    db.select({ 
        id: damage_reports.id,
        status: damage_reports.status,
        createdAt: damage_reports.createdAt,
        title: damage_reports.title,
        reporterId: damage_reports.reporterId
    })
    .from(damage_reports)
    .orderBy(desc(damage_reports.createdAt)),

    // Ambil semua tugas maintenance
    db.select({
        technicianId: maintenance_reports.technicianId,
        status: maintenance_reports.status
    }).from(maintenance_reports),

    // Ambil semua user dengan role teknisi
    db.select({
        id: users.id,
        name: users.name
    }).from(users).where(eq(users.role, 'technician'))
  ]);

  // 3. PROSES DATA: Statistik Utama
  const stats = [
    { 
      label: "Total Laporan", 
      value: allDamageReports.length.toString(), 
      change: "Semua waktu",
      icon: FileText,
      color: "bg-blue-100 text-blue-700"
    },
    { 
      label: "Menunggu", 
      value: allDamageReports.filter(r => r.status === 'menunggu').length.toString(), 
      change: "Perlu tindakan",
      icon: Clock,
      color: "bg-amber-100 text-amber-700"
    },
    { 
      label: "Dalam Proses", 
      value: allDamageReports.filter(r => r.status === 'dalam_proses' || r.status === 'menunggu_verifikasi').length.toString(), 
      change: "Sedang dikerjakan",
      icon: AlertCircle,
      color: "bg-cyan-100 text-cyan-700"
    },
    { 
      label: "Selesai", 
      value: allDamageReports.filter(r => r.status === 'selesai').length.toString(), 
      change: "Laporan ditutup",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700"
    },
  ];

  // 4. PROSES DATA: Statistik Teknisi
  // Gabungkan data teknisi dengan tugas yang mereka miliki
  const technicianStats = allTechnicians.map(tech => {
    const techTasks = allMaintenanceTasks.filter(t => t.technicianId === tech.id);
    const assigned = techTasks.length;
    const completed = techTasks.filter(t => t.status === 'selesai').length;
    const active = techTasks.filter(t => t.status !== 'selesai').length; // Tugas yg belum beres

    return {
        name: tech.name,
        assigned: assigned,
        completed: completed,
        // Jika sedang ada tugas aktif > 0, statusnya "Sibuk", jika 0 "Available"
        status: active > 0 ? "Sibuk" : "Tersedia", 
        statusColor: active > 0 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
    };
  });

  // 5. PROSES DATA: Aktivitas Terbaru (Ambil 5 Laporan Teratas)
  // Untuk activity log yang proper, idealnya ada tabel log terpisah. 
  // Tapi di sini kita pakai 'Laporan Masuk' sebagai aktivitas.
  const recentActivity = allDamageReports.slice(0, 5).map(report => ({
    action: "Laporan baru masuk",
    description: report.title,
    time: timeAgo(report.createdAt),
    type: "new"
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Dasbor Admin</h2>
        <p className="text-blue-600">Ringkasan operasional sistem dan kinerja teknisi.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-blue-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {/* Optional: Add percentage trend here if needed */}
                </div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <p className="text-xs text-blue-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Technician Overview */}
        <Card className="border-blue-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">Kinerja Teknisi</CardTitle>
            </div>
            <CardDescription className="text-slate-500">
              Monitoring beban kerja tim teknis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicianStats.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-4">Belum ada data teknisi.</p>
              ) : (
                  technicianStats.map((tech) => (
                    <div 
                      key={tech.name}
                      className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{tech.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                             <span className="font-medium text-blue-600">{tech.assigned} Total Tugas</span>
                             <span>•</span>
                             <span className="text-green-600">{tech.completed} Selesai</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${tech.statusColor}`}>
                        {tech.status}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity (Laporan Masuk) */}
        <Card className="border-blue-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Aktivitas Terkini</CardTitle>
            </div>
            <CardDescription className="text-slate-500">
              Laporan kerusakan terbaru yang masuk sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-4">Belum ada aktivitas.</p>
              ) : (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full mt-2 bg-blue-500 animate-pulse" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                        <p className="text-sm text-slate-600 line-clamp-1">{activity.description}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}