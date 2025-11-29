import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Sesuaikan path
import { db } from "@/database/drizzle"; // Sesuaikan path
import { damage_reports, maintenance_reports } from "@/database/schema"; // Import kedua tabel
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

// Helper styles (Updated)
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "dalam_proses": return "bg-cyan-500 hover:bg-cyan-600";
    case "menunggu_verifikasi": return "bg-purple-500 hover:bg-purple-600";
    case "selesai": return "bg-green-500 hover:bg-green-600";
    default: return "bg-amber-500 hover:bg-amber-600";
  }
};

export default async function TaskListPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const techId = parseInt(session.user.id);

  // --- QUERY PERBAIKAN ---
  // Ambil data dari tabel maintenance_reports (Tugas)
  // Join dengan damage_reports untuk dapat info detail kerusakan
  const allTasks = await db
    .select({
      // ID Tugas (maintenance report id) - PENTING untuk link detail
      id: maintenance_reports.id,
      
      // Info Kerusakan (dari parent)
      title: damage_reports.title,
      description: damage_reports.description,
      location: damage_reports.location,
      priority: damage_reports.priority, // Pastikan kolom ini ada di schema damage_reports
      
      // Info Status Pengerjaan (dari tabel maintenance)
      status: maintenance_reports.status,
      createdAt: maintenance_reports.createdAt, // Tanggal tugas dibuat/diassign
    })
    .from(maintenance_reports)
    .leftJoin(damage_reports, eq(maintenance_reports.damageReportId, damage_reports.id))
    .where(eq(maintenance_reports.technicianId, techId)) // Filter hanya tugas saya
    .orderBy(desc(maintenance_reports.createdAt));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Daftar Tugas Saya</h2>
          <p className="text-blue-600">Total {allTasks.length} laporan ditugaskan</p>
        </div>
        <Link href="/dashboard/technician">
          <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTasks.map((task) => (
          // Link menuju detail tugas berdasarkan ID Maintenance Report
          <Link key={task.id} href={`/dashboard/technician/tasks/${task.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-blue-200 group flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="border-blue-400 text-blue-600 bg-blue-50">
                    {/* Fallback jika priority null */}
                    {(task.priority || 'medium').toUpperCase()}
                  </Badge>
                  
                  <Badge className={`text-white border-0 ${getStatusColor(task.status || 'menunggu')}`}>
                    {task.status?.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg text-blue-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {task.title}
                </CardTitle>
                
                <CardDescription className="line-clamp-2 text-sm">
                  {task.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="mt-auto pt-0">
                <div className="flex flex-col gap-2 text-sm text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="truncate font-medium text-slate-700">{task.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>
                      {task.createdAt 
                        ? new Date(task.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
                        : '-'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        
        {allTasks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-dashed border-blue-200 text-slate-400">
            <p className="text-lg font-semibold text-slate-500">Tidak ada tugas aktif.</p>
            <p className="text-sm">Silakan hubungi admin jika belum ada penugasan.</p>
          </div>
        )}
      </div>
    </div>
  );
}