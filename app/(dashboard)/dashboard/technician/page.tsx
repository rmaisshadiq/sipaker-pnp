import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/drizzle"; // Sesuaikan path db anda
import { maintenance_reports, damage_reports } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, Wrench } from "lucide-react";

// Helper untuk format tanggal
const formatDate = (date: Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric"
  });
};

// Helper untuk warna Priority
const getPriorityBadge = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
    case "tinggi":
      return "border-red-500 text-red-600 bg-red-50";
    case "medium":
    case "sedang":
      return "border-amber-500 text-amber-600 bg-amber-50";
    default:
      return "border-blue-400 text-blue-600 bg-blue-50";
  }
};

// Helper untuk warna Status
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "dalam_proses":
    case "dalam proses":
      return "bg-cyan-500 hover:bg-cyan-600";
    case "selesai":
    case "selesai":
      return "bg-green-500 hover:bg-green-600";
    case "menunggu":
    case "menunggu":
      return "bg-amber-500 hover:bg-amber-600";
    default:
      return "bg-slate-500 hover:bg-slate-600";
  }
};

export default async function TechnicianDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) {
    redirect("/login");
  }

  const techId = parseInt(session.user.id);

  // 1. DATA FETCHING: Statistik
  // Kita ambil semua report milik teknisi ini untuk dihitung di JS (atau bisa pakai count SQL terpisah)
  const allMyTasks = await db
    .select({ status: maintenance_reports.status }) 
    .from(maintenance_reports)
    // Filter berdasarkan technicianId, BUKAN reporterId
    .where(eq(maintenance_reports.technicianId, techId));

  const countTotal = allMyTasks.length;
  const countPending = allMyTasks.filter(r => r.status === 'menunggu').length;
  const countProcess = allMyTasks.filter(r => r.status === 'dalam_proses').length;
  const countDone = allMyTasks.filter(r => r.status === 'selesai').length;

  // 2. DATA FETCHING: Laporan Terbaru (Limit 5)
  const assignedReports = await db
  .select({
      id: maintenance_reports.id,
      
      title: damage_reports.title,
      location: damage_reports.location,
      description: damage_reports.description,
      priority: damage_reports.priority,
      
      status: maintenance_reports.status,
      createdAt: maintenance_reports.createdAt, 
    })
    .from(maintenance_reports)
    .leftJoin(damage_reports, eq(maintenance_reports.damageReportId, damage_reports.id))
    .where(eq(maintenance_reports.technicianId, techId))
    .orderBy(desc(maintenance_reports.createdAt))
    .limit(5);

  const stats = [
    { 
      label: "Ditugaskan ke Saya", 
      value: countTotal.toString(), 
      icon: Wrench,
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
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Dasbor Teknisi</h2>
        <p className="text-blue-600">Halo, {session.user.name}. Berikut ringkasan tugas Anda.</p>
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
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
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

      {/* Assigned Reports List */}
      <Card className="border-blue-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
             <div>
                <CardTitle className="text-blue-900">Tugas Terbaru</CardTitle>
                <CardDescription className="text-slate-500">
                    5 Laporan terbaru yang ditugaskan kepada Anda
                </CardDescription>
             </div>
             <Link href="/dashboard/technician/tasks">
                <Button variant="outline" size="sm">Lihat Semua</Button>
             </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assignedReports.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                    Belum ada tugas yang diberikan.
                </div>
            ) : (
                assignedReports.map((report) => (
                <Link 
                    key={report.id} 
                    href={`/dashboard/technician/tasks/${report.id}`} // Link ke detail
                    className="block"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors group">
                        <div className="flex-1 mb-2 sm:mb-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-slate-400">#{report.id}</span>
                                <Badge variant="outline" className={getPriorityBadge(report.priority || 'medium')}>
                                    {(report.priority || 'medium').toUpperCase()}
                                </Badge>
                            </div>
                            <h4 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                {report.location}
                            </h4>
                            <p className="text-sm text-slate-500 line-clamp-1">
                                {report.title} {/* atau report.description */}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-right">
                            <div className="hidden sm:block">
                                <p className="text-xs text-slate-400">Tanggal Lapor</p>
                                <p className="text-sm font-medium text-slate-600">
                                    {formatDate(report.createdAt)}
                                </p>
                            </div>
                            <Badge className={`text-white border-0 ${getStatusColor(report.status || 'menunggu')}`}>
                                {(report.status || 'menunggu').replace('_', ' ')}
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