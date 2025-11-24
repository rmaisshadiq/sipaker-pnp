import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

export function AdminManagement() {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState("");

  const reports = [
    { 
      id: "RPT-2025-0156", 
      location: "Perpustakaan Utama - Lantai 2", 
      reporter: "Alice Cooper",
      status: "Dalam Proses", 
      date: "26 Okt 2025", 
      priority: "Tinggi",
      assignedTo: "John Smith"
    },
    { 
      id: "RPT-2025-0155", 
      location: "Gedung Sains - Ruang 301", 
      reporter: "Bob Martin",
      status: "Menunggu", 
      date: "25 Okt 2025", 
      priority: "Sedang",
      assignedTo: "-"
    },
    { 
      id: "RPT-2025-0154", 
      location: "Pusat Mahasiswa - Kafeteria", 
      reporter: "Carol White",
      status: "Selesai", 
      date: "24 Okt 2025", 
      priority: "Rendah",
      assignedTo: "Sarah Johnson"
    },
    { 
      id: "RPT-2025-0153", 
      location: "Asrama A - Ruang Bersama", 
      reporter: "David Lee",
      status: "Dalam Proses", 
      date: "23 Okt 2025", 
      priority: "Tinggi",
      assignedTo: "Mike Davis"
    },
    { 
      id: "RPT-2025-0152", 
      location: "Gedung Teknik - Lab 5", 
      reporter: "Eve Johnson",
      status: "Menunggu", 
      date: "22 Okt 2025", 
      priority: "Sedang",
      assignedTo: "-"
    },
    { 
      id: "RPT-2025-0151", 
      location: "Gedung Seni - Studio 2", 
      reporter: "Frank Miller",
      status: "Selesai", 
      date: "21 Okt 2025", 
      priority: "Rendah",
      assignedTo: "John Smith"
    },
  ];

  const handleAssign = (reportId: string) => {
    setSelectedReportId(reportId);
    setAssignDialogOpen(true);
  };

  const handleAssignSubmit = () => {
    toast.success("Laporan berhasil ditugaskan!");
    setAssignDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-blue-900">Kelola Laporan</h2>
        <p className="text-blue-600">Lihat, filter, dan tugaskan laporan kerusakan kepada teknisi</p>
      </div>

      <Card className="border-blue-400 bg-white shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Semua Laporan</CardTitle>
              <CardDescription className="text-blue-600">
                Kelola dan tugaskan laporan kepada teknisi
              </CardDescription>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <Input 
                placeholder="Cari berdasarkan ID, lokasi, atau pelapor..." 
                className="pl-10 border-blue-200 bg-white focus:border-blue-500"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40 border-blue-200 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="in-progress">Dalam Proses</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40 border-blue-200 bg-white">
                <SelectValue placeholder="Prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prioritas</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="low">Rendah</SelectItem>
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
                <TableHead className="text-blue-700">Pelapor</TableHead>
                <TableHead className="text-blue-700">Prioritas</TableHead>
                <TableHead className="text-blue-700">Status</TableHead>
                <TableHead className="text-blue-700">Ditugaskan Kepada</TableHead>
                <TableHead className="text-blue-700">Tanggal</TableHead>
                <TableHead className="text-blue-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="border-blue-100 hover:bg-blue-50">
                  <TableCell className="text-blue-900">{report.id}</TableCell>
                  <TableCell className="text-blue-600">{report.location}</TableCell>
                  <TableCell className="text-blue-600">{report.reporter}</TableCell>
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
                  <TableCell className="text-blue-600">{report.assignedTo}</TableCell>
                  <TableCell className="text-blue-600">{report.date}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                      onClick={() => handleAssign(report.id)}
                      disabled={report.status === "Selesai"}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Tugaskan
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="border-blue-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Tugaskan Laporan ke Teknisi</DialogTitle>
            <DialogDescription className="text-blue-600">
              {selectedReportId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="technician" className="text-blue-900">Pilih Teknisi</Label>
              <Select>
                <SelectTrigger className="border-blue-200 bg-white">
                  <SelectValue placeholder="Pilih teknisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech1">John Smith (12 ditugaskan)</SelectItem>
                  <SelectItem value="tech2">Sarah Johnson (8 ditugaskan)</SelectItem>
                  <SelectItem value="tech3">Mike Davis (15 ditugaskan)</SelectItem>
                  <SelectItem value="tech4">Emily Brown (10 ditugaskan)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-blue-900">Catatan (Opsional)</Label>
              <Input 
                id="notes"
                placeholder="Tambahkan instruksi khusus..."
                className="border-blue-200 bg-white focus:border-blue-500"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAssignDialogOpen(false)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Batal
            </Button>
            <Button 
              onClick={handleAssignSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Tugaskan Laporan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}