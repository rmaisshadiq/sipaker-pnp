"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye } from "lucide-react";
import { ReportGallery } from "@/components/ReportGallery"; // Gunakan galeri yg sudah kita buat

// Tipe data sesuai hasil query database
interface ReportData {
  id: string;
  location: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date | null;
  technicianName: string | null;
  images: string[] | null;
  title: string;
}

interface ReporterHistoryClientProps {
  initialData: ReportData[];
}

export function ReporterHistoryClient({ initialData }: ReporterHistoryClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  // Helper Warna
  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai": return "bg-green-500 hover:bg-green-600";
      case "dalam_proses": return "bg-cyan-500 hover:bg-cyan-600";
      case "menunggu_verifikasi": return "bg-purple-500 hover:bg-purple-600";
      default: return "bg-amber-500 hover:bg-amber-600";
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
        case "high": return "border-red-500 text-red-600 bg-red-50";
        case "medium": return "border-amber-500 text-amber-600 bg-amber-50";
        default: return "border-blue-400 text-blue-600 bg-blue-50";
    }
  };

  // Logika Filter & Search
  const filteredReports = initialData.filter((report) => {
    const matchesSearch = 
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Riwayat Laporan</h2>
        <p className="text-blue-600">Lihat dan lacak semua laporan yang telah Anda kirim</p>
      </div>

      <Card className="border-blue-400 bg-white shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-blue-900">Semua Laporan</CardTitle>
              <CardDescription className="text-blue-600">
                Total {filteredReports.length} laporan ditemukan
              </CardDescription>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <Input 
                placeholder="Cari ID, Lokasi, atau Judul..." 
                className="pl-10 border-blue-200 bg-white focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48 border-blue-200 bg-white">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="menunggu">Menunggu</SelectItem>
                <SelectItem value="dalam_proses">Dalam Proses</SelectItem>
                <SelectItem value="menunggu_verifikasi">Verifikasi</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border border-blue-100 overflow-hidden">
            <Table>
                <TableHeader className="bg-blue-50">
                <TableRow>
                    <TableHead className="text-blue-900 font-semibold">ID</TableHead>
                    <TableHead className="text-blue-900 font-semibold">Judul & Lokasi</TableHead>
                    <TableHead className="text-blue-900 font-semibold">Status</TableHead>
                    <TableHead className="text-blue-900 font-semibold hidden md:table-cell">Tanggal</TableHead>
                    <TableHead className="text-blue-900 font-semibold text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredReports.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                            Tidak ada laporan yang cocok dengan filter Anda.
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-mono text-xs text-blue-900">
                            #{report.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium text-blue-900 text-sm line-clamp-1">{report.title}</span>
                                <span className="text-xs text-blue-500 line-clamp-1">{report.location}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge className={`text-white border-0 text-[10px] ${getStatusColor(report.status)}`}>
                                {report.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-blue-600">
                            {report.createdAt ? new Date(report.createdAt).toLocaleDateString("id-ID") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-100"
                                onClick={() => setSelectedReport(report)}
                            >
                                <Eye className="h-4 w-4 mr-1" /> Lihat
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-900">Detail Laporan</DialogTitle>
            <DialogDescription className="text-blue-600 font-mono">
              ID: {selectedReport?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div>
                  <p className="text-xs text-blue-500 uppercase font-bold">Lokasi</p>
                  <p className="text-blue-900 font-medium">{selectedReport.location}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 uppercase font-bold">Status</p>
                  <Badge className={`mt-1 ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-blue-500 uppercase font-bold">Prioritas</p>
                  <Badge variant="outline" className={`mt-1 ${getPriorityColor(selectedReport.priority)}`}>
                    {selectedReport.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-blue-500 uppercase font-bold">Teknisi Bertugas</p>
                  <p className="text-blue-900 font-medium">
                    {selectedReport.technicianName || "Belum ditugaskan"}
                  </p>
                </div>
                <div className="md:col-span-2">
                    <p className="text-xs text-blue-500 uppercase font-bold">Waktu Lapor</p>
                    <p className="text-blue-900">
                        {selectedReport.createdAt 
                            ? new Date(selectedReport.createdAt).toLocaleString("id-ID", { dateStyle: 'full', timeStyle: 'short'}) 
                            : "-"}
                    </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-2">Deskripsi Masalah</p>
                <div className="text-slate-700 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm leading-relaxed">
                  {selectedReport.description}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-2">Bukti Foto</p>
                <ReportGallery images={selectedReport.images} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}