import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, FileText, Users, Wrench } from "lucide-react";

export function AdminDashboard() {
  const stats = [
    { 
      label: "Total Laporan", 
      value: "156", 
      change: "+12 minggu ini",
      icon: FileText,
      color: "bg-blue-100 text-blue-700"
    },
    { 
      label: "Menunggu", 
      value: "23", 
      change: "Perlu penugasan",
      icon: Clock,
      color: "bg-amber-100 text-amber-700"
    },
    { 
      label: "Dalam Proses", 
      value: "45", 
      change: "Sedang diselesaikan",
      icon: AlertCircle,
      color: "bg-cyan-100 text-cyan-700"
    },
    { 
      label: "Selesai", 
      value: "88", 
      change: "Bulan ini",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700"
    },
  ];

  const technicianStats = [
    { name: "John Smith", assigned: 12, completed: 45, status: "Aktif" },
    { name: "Sarah Johnson", assigned: 8, completed: 38, status: "Aktif" },
    { name: "Mike Davis", assigned: 15, completed: 52, status: "Aktif" },
    { name: "Emily Brown", assigned: 10, completed: 41, status: "Cuti" },
  ];

  const recentActivity = [
    { action: "Laporan baru dikirim", user: "Alice Cooper", time: "5 menit lalu", type: "new" },
    { action: "Laporan RPT-2025-0156 diperbarui", user: "John Smith", time: "15 menit lalu", type: "update" },
    { action: "Laporan RPT-2025-0155 ditugaskan ke Sarah Johnson", user: "Admin", time: "1 jam lalu", type: "assign" },
    { action: "Laporan RPT-2025-0154 selesai", user: "Mike Davis", time: "2 jam lalu", type: "complete" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-blue-900">Dasbor Admin</h2>
        <p className="text-blue-600">Ringkasan semua laporan kerusakan fasilitas dan status teknisi</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-blue-400 bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-sm text-blue-600">{stat.label}</p>
                <p className="text-blue-900 mt-1">{stat.value}</p>
                <p className="text-xs text-blue-400 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technician Overview */}
        <Card className="border-blue-400 bg-white shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">Ringkasan Teknisi</CardTitle>
            </div>
            <CardDescription className="text-blue-600">
              Beban kerja dan status saat ini dari semua teknisi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {technicianStats.map((tech) => (
                <div 
                  key={tech.name}
                  className="flex items-center justify-between p-3 border border-blue-100 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-blue-900">{tech.name}</p>
                      <p className="text-xs text-blue-600">
                        {tech.assigned} ditugaskan • {tech.completed} selesai
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    tech.status === "Aktif" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {tech.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-blue-400 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-blue-900">Aktivitas Terbaru</CardTitle>
            <CardDescription className="text-blue-600">
              Tindakan dan pembaruan terbaru dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "new" 
                      ? "bg-blue-500" 
                      : activity.type === "complete"
                      ? "bg-green-500"
                      : "bg-cyan-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900">{activity.action}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      oleh {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}