import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; "@/components/ui/table";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface TechnicianReportDetailProps {
  onNavigate: (view: string) => void;
}

export function TechnicianReportDetail({ onNavigate }: TechnicianReportDetailProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const reports = [
    { 
      id: "RPT-2025-0156", 
      location: "Perpustakaan Utama - Lantai 2", 
      description: "Jendela pecah di dekat area belajar",
      reporter: "Alice Cooper",
      status: "Dalam Proses", 
      date: "26 Okt 2025", 
      priority: "Tinggi"
    },
    { 
      id: "RPT-2025-0153", 
      location: "Asrama A - Ruang Bersama", 
      description: "Gagang pintu rusak",
      reporter: "David Lee",
      status: "Menunggu", 
      date: "23 Okt 2025", 
      priority: "Tinggi"
    },
    { 
      id: "RPT-2025-0151", 
      location: "Gedung Seni - Studio 2", 
      description: "Ubin lantai rusak",
      reporter: "Frank Miller",
      status: "Dalam Proses", 
      date: "21 Okt 2025", 
      priority: "Sedang"
    },
  ];

  const [selectedReport, setSelectedReport] = useState(reports[0]);

  const handleFileUpload = () => {
    setUploadedFiles([...uploadedFiles, `completion_photo_${uploadedFiles.length + 1}.jpg`]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Laporan berhasil diperbarui!");
  };

  return (
    <div className="p-6">
      <Button 
        variant="ghost" 
        className="mb-4 text-blue-600 hover:text-blue-900 hover:bg-blue-50"
        onClick={() => onNavigate("dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Dasbor
      </Button>

      <div className="mb-6">
        <h2 className="text-blue-900">Laporan Ditugaskan</h2>
        <p className="text-blue-600">Lihat dan perbarui laporan kerusakan yang ditugaskan kepada Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <Card className="border-blue-400 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-blue-900">Laporan Saya</CardTitle>
            <CardDescription className="text-blue-600">
              Klik untuk melihat detail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedReport.id === report.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-blue-200 hover:bg-blue-50"
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-blue-900">{report.id}</p>
                    <Badge 
                      variant="outline"
                      className={
                        report.priority === "Tinggi" 
                          ? "border-red-500 text-red-600 bg-red-50" 
                          : "border-amber-500 text-amber-600 bg-amber-50"
                      }
                    >
                      {report.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-blue-600">{report.location}</p>
                  <Badge 
                    className={`mt-2 ${
                      report.status === "Dalam Proses"
                        ? "bg-cyan-500 text-white hover:bg-cyan-600"
                        : "bg-amber-500 text-white hover:bg-amber-600"
                    }`}
                  >
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Detail and Update Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Details */}
          <Card className="border-blue-400 bg-white shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-900">Detail Laporan</CardTitle>
                  <CardDescription className="text-blue-600">
                    {selectedReport.id}
                  </CardDescription>
                </div>
                <Badge 
                  className={
                    selectedReport.status === "Dalam Proses"
                      ? "bg-cyan-500 text-white hover:bg-cyan-600"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }
                >
                  {selectedReport.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-500">Lokasi</p>
                  <p className="text-blue-900">{selectedReport.location}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500">Prioritas</p>
                  <Badge 
                    variant="outline"
                    className={
                      selectedReport.priority === "Tinggi" 
                        ? "border-red-500 text-red-600 bg-red-50" 
                        : "border-amber-500 text-amber-600 bg-amber-50"
                    }
                  >
                    {selectedReport.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-blue-500">Dilaporkan Oleh</p>
                  <p className="text-blue-900">{selectedReport.reporter}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-500">Tanggal Dilaporkan</p>
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
                <p className="text-sm text-blue-500 mb-2">Foto Asli</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-blue-100 rounded border border-blue-200 flex items-center justify-center">
                    <span className="text-xs text-blue-500">Foto 1</span>
                  </div>
                  <div className="aspect-square bg-blue-100 rounded border border-blue-200 flex items-center justify-center">
                    <span className="text-xs text-blue-500">Foto 2</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update Form */}
          <Card className="border-blue-400 bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-blue-900">Perbarui Status</CardTitle>
              <CardDescription className="text-blue-600">
                Perbarui kemajuan dan tambahkan foto penyelesaian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-blue-900">Status</Label>
                  <Select name="status" defaultValue="in-progress">
                    <SelectTrigger className="border-blue-200 bg-white">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="in-progress">Dalam Proses</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actions" className="text-blue-900">Tindakan yang Diambil</Label>
                  <Textarea 
                    id="actions"
                    placeholder="Jelaskan pekerjaan yang dilakukan..."
                    className="border-blue-200 bg-white min-h-24 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-900">Foto Penyelesaian</Label>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-blue-50">
                    <Upload className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-blue-700 mb-2">Unggah foto penyelesaian</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      onClick={handleFileUpload}
                    >
                      Pilih File
                    </Button>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200"
                        >
                          <span className="text-sm text-blue-900">{file}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Perbarui Laporan
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Simpan Draf
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}