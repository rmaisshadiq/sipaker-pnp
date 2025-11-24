import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye } from "lucide-react";

export function ReporterHistory() {
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const reports = [
    { 
      id: "RPT-2025-0156", 
      location: "Perpustakaan Utama - Lantai 2", 
      description: "Jendela pecah di dekat area belajar",
      status: "Dalam Proses", 
      date: "26 Okt 2025", 
      priority: "Tinggi",
      assignedTo: "John Smith"
    },
    { 
      id: "RPT-2025-0155", 
      location: "Gedung Sains - Ruang 301", 
      description: "Kebocoran air dari plafon",
      status: "Menunggu", 
      date: "25 Okt 2025", 
      priority: "Sedang",
      assignedTo: "-"
    },
    { 
      id: "RPT-2025-0154", 
      location: "Pusat Mahasiswa - Kafeteria", 
      description: "Meja dan kursi rusak",
      status: "Selesai", 
      date: "24 Okt 2025", 
      priority: "Rendah",
      assignedTo: "Sarah Johnson"
    },
    { 
      id: "RPT-2025-0153", 
      location: "Asrama A - Ruang Bersama", 
      description: "Gagang pintu rusak",
      status: "Dalam Proses", 
      date: "23 Okt 2025", 
      priority: "Tinggi",
      assignedTo: "Mike Davis"
    },
    { 
      id: "RPT-2025-0152", 
      location: "Gedung Teknik - Lab 5", 
      description: "Stop kontak listrik tidak berfungsi",
      status: "Selesai", 
      date: "22 Okt 2025", 
      priority: "Sedang",
      assignedTo: "John Smith"
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-blue-900">Riwayat Laporan</h2>
        <p className="text-blue-600">Lihat dan lacak semua laporan yang telah Anda kirim</p>
      </div>

      <Card className="border-blue-400 bg-white shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Semua Laporan</CardTitle>
              <CardDescription className="text-blue-600">
                Filter dan cari riwayat laporan Anda
              </CardDescription>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <Input 
                placeholder="Cari berdasarkan ID atau lokasi..." 
                className="pl-10 border-blue-200 bg-white focus:border-blue-500"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48 border-blue-200 bg-white">
                <SelectValue placeholder="Filter berdasarkan status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="in-progress">Dalam Proses</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-blue-100">
                <TableHead className="text-blue-700">ID Laporan</TableHead>
                <TableHead className="text-blue-700">Lokasi</TableHead>
                <TableHead className="text-blue-700">Prioritas</TableHead>
                <TableHead className="text-blue-700">Status</TableHead>
                <TableHead className="text-blue-700">Tanggal</TableHead>
                <TableHead className="text-blue-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="border-blue-100 hover:bg-blue-50">
                  <TableCell className="text-blue-900">{report.id}</TableCell>
                  <TableCell className="text-blue-600">{report.location}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        report.priority === "Tinggi" 
                          ? "border-red-500 text-red-600 bg-red-50" 
                          : report.priority === "Sedang"
                          ? "border-amber-500 text-amber-600 bg-amber-50"
                          : "border-blue-400 text-blue-600 bg-blue-50"
                      }
                    >
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        report.status === "Selesai" 
                          ? "bg-green-500 text-white hover:bg-green-600" 
                          : report.status === "Dalam Proses"
                          ? "bg-cyan-500 text-white hover:bg-cyan-600"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-blue-600">{report.date}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="border-blue-200 bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Detail Laporan</DialogTitle>
            <DialogDescription className="text-blue-600">
              {selectedReport?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-500">Lokasi</p>
                  <p className="text-blue-900">{selectedReport.location}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500">Status</p>
                  <Badge className={
                    selectedReport.status === "Selesai" 
                      ? "bg-green-500 text-white hover:bg-green-600" 
                      : selectedReport.status === "Dalam Proses"
                      ? "bg-cyan-500 text-white hover:bg-cyan-600"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }>
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-blue-500">Prioritas</p>
                  <Badge variant="outline" className={
                    selectedReport.priority === "Tinggi" 
                      ? "border-red-500 text-red-600 bg-red-50" 
                      : selectedReport.priority === "Sedang"
                      ? "border-amber-500 text-amber-600 bg-amber-50"
                      : "border-blue-400 text-blue-600 bg-blue-50"
                  }>
                    {selectedReport.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-blue-500">Ditugaskan Kepada</p>
                  <p className="text-blue-900">{selectedReport.assignedTo}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500">Tanggal Pengajuan</p>
                  <p className="text-blue-900">{selectedReport.date}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-blue-500 mb-2">Deskripsi</p>
                <p className="text-blue-900 p-3 bg-blue-50 rounded border border-blue-200">
                  {selectedReport.description}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-blue-500 mb-2">Foto</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-blue-100 rounded border border-blue-200 flex items-center justify-center">
                    <span className="text-xs text-blue-500">Foto 1</span>
                  </div>
                  <div className="aspect-square bg-blue-100 rounded border border-blue-200 flex items-center justify-center">
                    <span className="text-xs text-blue-500">Foto 2</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}