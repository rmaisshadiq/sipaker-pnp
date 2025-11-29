"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, UserCog, CheckCircle, Eye, Loader2 } from "lucide-react";
import { ReportGallery } from "@/components/ReportGallery"; // Pakai galeri foto yg sudah ada
import { assignTechnician, verifyReportCompletion } from "@/lib/actions/admin";

// Tipe Data Props
interface Technician {
  id: number;
  name: string;
}

interface ReportData {
  id: string;
  title: string;
  location: string;
  status: string;
  priority: string;
  createdAt: Date | null;
  reporterName: string | null;
  technicianName: string | null;
  maintenanceId: string | null; // ID tabel maintenance (untuk verifikasi)
  technicianNotes: string | null;
  completionImages: string[] | null;
}

export function AdminReportsClient({ reports, technicians }: { reports: ReportData[], technicians: Technician[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  
  // State untuk Assign Teknisi
  const [selectedTechId, setSelectedTechId] = useState<string>("");
  
  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // --- FILTERING ---
  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- ACTIONS HANDLERS ---
  
  // 1. Handle Assign Teknisi
  const handleAssign = async () => {
    if (!selectedReport || !selectedTechId) return;
    setIsLoading(true);
    
    const res = await assignTechnician(selectedReport.id, parseInt(selectedTechId));
    
    if (res.success) {
      toast.success(res.message);
      setSelectedReport(null);
      setSelectedTechId("");
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  // 2. Handle Verifikasi Selesai
  const handleVerify = async () => {
    if (!selectedReport || !selectedReport.maintenanceId) return;
    setIsLoading(true);

    const res = await verifyReportCompletion(selectedReport.maintenanceId, selectedReport.id);

    if (res.success) {
      toast.success(res.message);
      setSelectedReport(null);
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  // Helper Warna Status
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'menunggu': return "bg-amber-500";
      case 'dalam_proses': return "bg-blue-500";
      case 'menunggu_verifikasi': return "bg-purple-500"; // Penting untuk admin
      case 'selesai': return "bg-green-500";
      default: return "bg-slate-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Manajemen Laporan</h2>
          <p className="text-blue-600">Kelola, tugaskan, dan verifikasi laporan masuk.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Cari ID, Judul, Lokasi..." 
            className="pl-9 bg-white border-blue-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-blue-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead className="font-semibold text-blue-900">ID & Tanggal</TableHead>
                <TableHead className="font-semibold text-blue-900">Judul Masalah</TableHead>
                <TableHead className="font-semibold text-blue-900">Lokasi</TableHead>
                <TableHead className="font-semibold text-blue-900">Teknisi</TableHead>
                <TableHead className="font-semibold text-blue-900">Status</TableHead>
                <TableHead className="text-right font-semibold text-blue-900">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-blue-50/50">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs text-slate-500">#{report.id.slice(0,6)}</span>
                      <span className="text-xs text-slate-700">
                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{report.title}</TableCell>
                  <TableCell className="text-slate-600">{report.location}</TableCell>
                  <TableCell>
                    {report.technicianName ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                          {report.technicianName.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-700">{report.technicianName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Belum ditugaskan</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white border-0 hover:opacity-90 ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant={report.status === 'menunggu' ? "default" : "outline"}
                      size="sm"
                      className={
                        report.status === 'menunggu' 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : report.status === 'menunggu_verifikasi'
                        ? "border-purple-500 text-purple-600 hover:bg-purple-50"
                        : "text-slate-600"
                      }
                      onClick={() => setSelectedReport(report)}
                    >
                      {report.status === 'menunggu' && <><UserCog className="w-4 h-4 mr-2"/> Tugaskan</>}
                      {report.status === 'menunggu_verifikasi' && <><CheckCircle className="w-4 h-4 mr-2"/> Verifikasi</>}
                      {(report.status === 'dalam_proses' || report.status === 'selesai') && <><Eye className="w-4 h-4 mr-2"/> Detail</>}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- MODAL DINAMIS BERDASARKAN STATUS --- */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-900">
              {selectedReport?.status === 'menunggu' ? "Tugaskan Teknisi" : "Detail Laporan"}
            </DialogTitle>
            <DialogDescription>
              ID: {selectedReport?.id} • {selectedReport?.location}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              
              {/* 1. Detail Masalah (Selalu Muncul) */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Laporan Pelapor ({selectedReport.reporterName})</h4>
                <p className="text-slate-800 text-sm mb-4">{selectedReport.title}</p>
                {/* Note: Anda bisa menambahkan ReportGallery (Foto Pelapor) disini juga jika data tersedia */}
              </div>

              {/* 2. Jika Status MENUNGGU: Form Assign Teknisi */}
              {selectedReport.status === 'menunggu' && (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label>Pilih Teknisi</Label>
                    <Select onValueChange={setSelectedTechId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih teknisi yang tersedia..." />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id.toString()}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleAssign} 
                      disabled={!selectedTechId || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <UserCog className="w-4 h-4 mr-2"/>}
                      Konfirmasi Penugasan
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {/* 3. Jika Status MENUNGGU VERIFIKASI: Bukti Teknisi & Tombol Approve */}
              {selectedReport.status === 'menunggu_verifikasi' && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="text-sm font-bold text-purple-700">Laporan Penyelesaian Teknisi</h4>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-sm">
                    <p className="font-semibold mb-1">Catatan:</p>
                    <p>{selectedReport.technicianNotes || "Tidak ada catatan."}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-2">Foto Bukti Perbaikan:</p>
                    <ReportGallery images={selectedReport.completionImages} />
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                      Tolak / Revisi
                    </Button>
                    <Button 
                      onClick={handleVerify} 
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <CheckCircle className="w-4 h-4 mr-2"/>}
                      Verifikasi & Tutup Tiket
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {/* 4. Jika Status SELESAI / DALAM PROSES (Read Only View) */}
              {(selectedReport.status === 'selesai' || selectedReport.status === 'dalam_proses') && (
                 <div className="border-t pt-4 text-center text-slate-500 text-sm">
                    {selectedReport.status === 'selesai' 
                      ? "Laporan ini telah selesai dan diverifikasi." 
                      : `Sedang dikerjakan oleh ${selectedReport.technicianName}`
                    }
                 </div>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}