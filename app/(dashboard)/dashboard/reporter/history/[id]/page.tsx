import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/drizzle";
import { damage_reports, maintenance_reports, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, User, CheckCircle2 } from "lucide-react";
import { ReportGallery } from "@/components/ReportGallery";

// Helper Warna Status
const getStatusColor = (status: string) => {
  switch (status) {
    case "selesai": return "bg-green-500 hover:bg-green-600";
    case "dalam_proses": return "bg-cyan-500 hover:bg-cyan-600";
    case "menunggu_verifikasi": return "bg-purple-500 hover:bg-purple-600";
    default: return "bg-amber-500 hover:bg-amber-600";
  }
};

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) redirect("/login");

  const resolvedParams = await params;
  const reportId = resolvedParams.id;
  const reporterId = parseInt(session.user.id);

  // Validasi format UUID
  if (!uuidRegex.test(reportId)) notFound();

  // --- QUERY DATABASE ---
  // Ambil detail laporan DAN join ke maintenance untuk melihat progress teknisi
  const reportData = await db
    .select({
      // Info Laporan Utama
      id: damage_reports.id,
      title: damage_reports.title,
      description: damage_reports.description,
      location: damage_reports.location,
      status: damage_reports.status,
      priority: damage_reports.priority,
      createdAt: damage_reports.createdAt,
      updatedAt: damage_reports.updatedAt,
      reportImages: damage_reports.images, // Foto kerusakan awal

      // Info Teknisi & Pengerjaan (dari tabel maintenance)
      technicianName: users.name,
      technicianNotes: maintenance_reports.technicianNotes,
      completionImages: maintenance_reports.images, // Foto bukti perbaikan
      completedAt: maintenance_reports.completedAt,
    })
    .from(damage_reports)
    .leftJoin(maintenance_reports, eq(damage_reports.id, maintenance_reports.damageReportId))
    .leftJoin(users, eq(maintenance_reports.technicianId, users.id)) // Join ke tabel user (teknisi)
    .where(
      and(
        eq(damage_reports.id, reportId),
        eq(damage_reports.reporterId, reporterId) // KEAMANAN: Hanya boleh lihat laporan sendiri
      )
    )
    .limit(1);

  if (reportData.length === 0) notFound();

  const report = reportData[0];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header & Navigasi */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/reporter/history">
          <Button variant="ghost" className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
        <div className="text-right">
            <p className="text-xs text-slate-500 font-mono">ID: {report.id.slice(0,8)}...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: STATUS & INFO UTAMA */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-bold">Status Laporan</CardTitle>
                </CardHeader>
                <CardContent>
                    <Badge className={`w-full justify-center py-1.5 text-base mb-4 ${getStatusColor(report.status)}`}>
                        {report.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-700">Tanggal Lapor</p>
                                <p className="text-slate-600">
                                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString("id-ID", { dateStyle: 'long' }) : '-'}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {report.createdAt ? new Date(report.createdAt).toLocaleTimeString("id-ID", { timeStyle: 'short' }) : ''} WIB
                                </p>
                            </div>
                        </div>

                        <Separator className="bg-blue-200" />

                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-700">Lokasi</p>
                                <p className="text-slate-600">{report.location}</p>
                            </div>
                        </div>

                        <Separator className="bg-blue-200" />

                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-700">Teknisi</p>
                                {report.technicianName ? (
                                    <p className="text-blue-700 font-medium">{report.technicianName}</p>
                                ) : (
                                    <p className="text-slate-400 italic">Belum ditugaskan</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* KOLOM KANAN: DETAIL MASALAH & PENYELESAIAN */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Bagian 1: Laporan Awal */}
            <Card className="border-blue-200 bg-white shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl text-blue-900">{report.title}</CardTitle>
                    <CardDescription>Detail kerusakan yang Anda laporkan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Deskripsi Kerusakan</h4>
                        <p className="p-3 bg-slate-50 border border-slate-100 rounded-md text-slate-700 leading-relaxed text-sm">
                            {report.description}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Foto Kerusakan (Awal)</h4>
                        <ReportGallery images={report.reportImages} />
                    </div>
                </CardContent>
            </Card>

            {/* Bagian 2: Hasil Perbaikan (Hanya muncul jika sudah dikerjakan) */}
            {(report.status === 'selesai' || report.status === 'menunggu_verifikasi') && (
                <Card className="border-green-200 bg-green-50/30 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                            <CardTitle className="text-green-800">Laporan Penyelesaian</CardTitle>
                        </div>
                        <CardDescription>
                            Hasil perbaikan yang dilakukan oleh teknisi
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                                <p className="text-xs text-green-700 font-bold uppercase">Diselesaikan Pada</p>
                                <p className="text-sm text-green-900">
                                    {report.completedAt ? new Date(report.completedAt).toLocaleString("id-ID") : "-"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-green-800 mb-2">Catatan Teknisi</h4>
                            <p className="p-3 bg-white border border-green-100 rounded-md text-slate-700 leading-relaxed text-sm">
                                {report.technicianNotes || "Tidak ada catatan tambahan."}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-green-800 mb-2">Bukti Perbaikan (Foto Akhir)</h4>
                            <ReportGallery images={report.completionImages} />
                        </div>
                    </CardContent>
                </Card>
            )}

        </div>
      </div>
    </div>
  );
}