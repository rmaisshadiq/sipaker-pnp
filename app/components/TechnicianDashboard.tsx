import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, Wrench } from "lucide-react";

interface TechnicianDashboardProps {
  onNavigate: (view: string) => void;
}

export function TechnicianDashboard({ onNavigate }: TechnicianDashboardProps) {
  const stats = [
    { 
      label: "Ditugaskan ke Saya", 
      value: "12", 
      icon: Wrench,
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
      value: "7", 
      icon: AlertCircle,
      color: "bg-cyan-100 text-cyan-700"
    },
    { 
      label: "Selesai", 
      value: "45", 
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700"
    },
  ];

  const assignedReports = [
    { 
      id: "RPT-2025-0156", 
      location: "Perpustakaan Utama - Lantai 2", 
      description: "Jendela pecah di dekat area belajar",
      status: "Dalam Proses", 
      date: "26 Okt 2025", 
      priority: "Tinggi"
    },
    { 
      id: "RPT-2025-0153", 
      location: "Asrama A - Ruang Bersama", 
      description: "Gagang pintu rusak",
      status: "Menunggu", 
      date: "23 Okt 2025", 
      priority: "Tinggi"
    },
    { 
      id: "RPT-2025-0151", 
      location: "Gedung Seni - Studio 2", 
      description: "Ubin lantai rusak",
      status: "Dalam Proses", 
      date: "21 Okt 2025", 
      priority: "Sedang"
    },
    { 
      id: "RPT-2025-0148", 
      location: "Gym - Ruang Loker", 
      description: "Lampu rusak",
      status: "Menunggu", 
      date: "20 Okt 2025", 
      priority: "Rendah"
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-blue-900">Dasbor Teknisi</h2>
        <p className="text-blue-600">Selamat datang! Berikut ringkasan beban kerja Anda.</p>
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

      {/* Assigned Reports */}
      <Card className="border-blue-400 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-blue-900">Laporan Ditugaskan</CardTitle>
          <CardDescription className="text-blue-600">
            Laporan yang saat ini ditugaskan kepada Anda - diprioritaskan berdasarkan urgensi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assignedReports.map((report) => (
              <div 
                key={report.id} 
                className="flex items-center justify-between p-4 border border-blue-100 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => onNavigate("assigned-reports")}
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
                  <p className="text-sm text-blue-500 mt-1">{report.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-blue-500">{report.date}</p>
                    <Badge 
                      className={
                        report.status === "Dalam Proses"
                          ? "bg-cyan-500 text-white mt-1 hover:bg-cyan-600"
                          : "bg-amber-500 text-white mt-1 hover:bg-amber-600"
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Perbarui
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4 border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => onNavigate("assigned-reports")}
          >
            Lihat Semua Laporan Ditugaskan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}