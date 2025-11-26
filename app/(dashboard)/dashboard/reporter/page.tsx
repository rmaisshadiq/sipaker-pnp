import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";

interface ReporterDashboardProps {
  onNavigate: (view: string) => void;
}

export function ReporterDashboard({ onNavigate }: ReporterDashboardProps) {
  const stats = [
    { 
      label: "Total Laporan", 
      value: "12", 
      icon: FileText,
      color: "bg-blue-100 text-blue-700"
    },
    { 
      label: "Menunggu", 
      value: "3", 
      icon: Clock,
      color: "bg-amber-100 text-amber-700"
    },
    { 
      label: "Dalam Proses", 
      value: "5", 
      icon: AlertCircle,
      color: "bg-cyan-100 text-cyan-700"
    },
    { 
      label: "Selesai", 
      value: "4", 
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700"
    },
  ];

  const recentReports = [
    { id: "RPT-2025-0156", location: "Perpustakaan Utama - Lantai 2", status: "Dalam Proses", date: "26 Okt 2025", priority: "Tinggi" },
    { id: "RPT-2025-0155", location: "Gedung Sains - Ruang 301", status: "Menunggu", date: "25 Okt 2025", priority: "Sedang" },
    { id: "RPT-2025-0154", location: "Pusat Mahasiswa - Kafeteria", status: "Selesai", date: "24 Okt 2025", priority: "Rendah" },
    { id: "RPT-2025-0153", location: "Asrama A - Ruang Bersama", status: "Dalam Proses", date: "23 Okt 2025", priority: "Tinggi" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-blue-900">Dasbor</h2>
          <p className="text-blue-600">Selamat datang! Berikut ringkasan laporan Anda.</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onNavigate("submit-report")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Laporan Baru
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-blue-400 bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">{stat.label}</p>
                    <p className="text-blue-900 mt-1">{stat.value}</p>
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

      {/* Recent Reports */}
      <Card className="border-blue-400 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-blue-900">Laporan Terbaru</CardTitle>
          <CardDescription className="text-blue-600">
            Laporan kerusakan terbaru Anda dan status saat ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div 
                key={report.id} 
                className="flex items-center justify-between p-4 border border-blue-100 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => onNavigate("history")}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-blue-900">{report.id}</p>
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
                  </div>
                  <p className="text-sm text-blue-600 mt-1">{report.location}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-blue-500">{report.date}</p>
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
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4 border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => onNavigate("history")}
          >
            Lihat Semua Laporan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}