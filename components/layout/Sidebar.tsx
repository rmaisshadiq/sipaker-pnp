import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Users, 
  Settings, 
  LogOut,
  ClipboardList,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  userRole: "reporter" | "admin" | "technician";
  onLogout: () => void;
}

export function Sidebar({ activeView, onNavigate, userRole, onLogout }: SidebarProps) {
  const reporterMenuItems = [
    { id: "dashboard", label: "Dasbor", icon: LayoutDashboard },
    { id: "submit-report", label: "Buat Laporan", icon: FileText },
    { id: "history", label: "Riwayat Laporan", icon: History },
  ];

  const adminMenuItems = [
    { id: "dashboard", label: "Dasbor", icon: LayoutDashboard },
    { id: "manage-reports", label: "Kelola Laporan", icon: ClipboardList },
  ];

  const technicianMenuItems = [
    { id: "dashboard", label: "Dasbor", icon: LayoutDashboard },
    { id: "assigned-reports", label: "Laporan Ditugaskan", icon: Wrench },
  ];

  const menuItems = 
    userRole === "reporter" 
      ? reporterMenuItems 
      : userRole === "admin" 
      ? adminMenuItems 
      : technicianMenuItems;

  return (
    <aside className="w-64 border-r border-blue-400 bg-blue-900 flex flex-col h-full shadow-lg">
      <div className="p-6 border-b border-blue-800">
        <h2 className="text-blue-50">Navigasi</h2>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  activeView === item.id 
                    ? "bg-blue-700 text-white hover:bg-blue-600" 
                    : "text-blue-100 hover:bg-blue-800 hover:text-white"
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
        
        <Separator className="my-4 bg-blue-800" />
        
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-blue-100 hover:bg-blue-800 hover:text-white">
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-blue-100 hover:bg-blue-800 hover:text-white"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      </nav>
    </aside>
  );
}