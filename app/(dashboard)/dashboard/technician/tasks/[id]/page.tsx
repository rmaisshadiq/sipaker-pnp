import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/drizzle";
import { damage_reports, users, maintenance_reports } from "@/database/schema"; // Asumsi users ada untuk join reporter name
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TaskUpdateForm } from "@/components/TaskUpdateForm"; // Import form tadi

// Helper warna priority

// Helper warna status
const getStatusColor = (s: string) => {
  if (s === 'in_progress') return "bg-cyan-500 hover:bg-cyan-600";
  if (s === 'completed') return "bg-green-500 hover:bg-green-600";
  return "bg-amber-500 hover:bg-amber-600";
};

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const resolvedParams = await params; 
  const maintenanceId = resolvedParams.id;


  if (!uuidRegex.test(maintenanceId)) {
    notFound();
  }

  // 1. Fetch Detail Laporan Saat Ini (Join dengan User untuk nama reporter)
const reportDetail = await db
    .select({
        // ID Maintenance (penting untuk form update)
        maintenanceId: maintenance_reports.id,
        
        // Status Pengerjaan (dari tabel maintenance)
        status: maintenance_reports.status,
        
        // Foto Bukti Penyelesaian (dari tabel maintenance)
        completionImages: maintenance_reports.images, 
        
        // Info Kerusakan (dari tabel damage_reports)
        damageReportId: damage_reports.id,
        title: damage_reports.title,
        description: damage_reports.description,
        location: damage_reports.location,
        priority: damage_reports.priority,
        createdAt: damage_reports.createdAt,
        
        // Nama Pelapor
        reporterName: users.name, 
    })
    .from(maintenance_reports) // <--- UTAMA: Cari di maintenance_reports
    .leftJoin(damage_reports, eq(maintenance_reports.damageReportId, damage_reports.id)) // Join ke info kerusakan
    .leftJoin(users, eq(damage_reports.reporterId, users.id)) // Join ke user pelapor
    .where(eq(maintenance_reports.id, maintenanceId)) // <--- Filter pakai maintenance ID
    .limit(1);

  if (reportDetail.length === 0) notFound();
  
  const currentTask = reportDetail[0];

  // 2. Fetch List Laporan Lain (Untuk Sidebar Kiri)
  // const myReports = await db
  //   .select()
  //   .from(damage_reports)
  //   .where(eq(damage_reports.reporterId, techId))
  //   .orderBy(desc(damage_reports.createdAt))
  //   .limit(10); 

  return (
    <div className="p-6">
      {/* Header Navigasi */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Detail Tugas</h2>
          <p className="text-blue-600">ID Tugas: {currentTask.maintenanceId.slice(0, 8)}...</p>
        </div>
        <Link href="/dashboard/technician">
          <Button variant="ghost" className="text-blue-600 hover:text-blue-900 hover:bg-blue-50">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dasbor
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KANAN: Detail & Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detail Laporan (Read Only) */}
          <Card className="border-blue-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-blue-900">{currentTask.location}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    Dilaporkan oleh: <span className="font-semibold text-slate-700">{currentTask.reporterName || "Anonim"}</span>
                  </CardDescription>
                </div>
                <Badge className={`px-3 py-1 text-sm ${getStatusColor(currentTask.status || 'pending')}`}>
                  {currentTask.status?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Tanggal Laporan</p>
                  <p className="font-medium text-slate-900">
                    {currentTask.createdAt 
                        ? new Date(currentTask.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) 
                        : '-'}
                  </p>
                </div>
                <div>
                   <p className="text-slate-500 mb-1">Prioritas</p>
                   <Badge variant="outline" className="border-blue-400 text-blue-600 bg-blue-50">
                      {(currentTask.priority || 'medium').toUpperCase()}
                   </Badge>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Deskripsi Kerusakan</p>
                <p className="text-slate-800 leading-relaxed">
                  {currentTask.description || currentTask.title}
                </p>
              </div>

              {/* FOTO KERUSAKAN (Dari Damage Reports) */}
              {/* Note: Jika Anda menyimpan foto kerusakan di tabel damage_reports, Anda perlu menambahkannya ke SELECT query di atas */}
              {/* <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Foto Kerusakan Awal</p>
                <ReportGallery images={currentTask.damageImages} />
              </div> */}

            </CardContent>
          </Card>

          {/* Form Update (Client Component) */}
          <Card className="border-blue-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-900">Laporan Penyelesaian</CardTitle>
              <CardDescription>Isi form ini jika Anda telah melakukan perbaikan</CardDescription>
            </CardHeader>
            <CardContent>
              {/* PENTING: 
                  Kita mengirim maintenanceId ke form, bukan damageReportId.
                  Karena form ini akan mengupdate tabel maintenance_reports.
              */}
              <TaskUpdateForm reportId={currentTask.maintenanceId} />
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}