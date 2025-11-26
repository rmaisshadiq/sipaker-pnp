import React, { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Users, 
  Settings, 
  LogOut,
  ClipboardList,
  Wrench,
  ChevronLeft, // Used for collapsing indicator
  ChevronRight // Used for expanding indicator
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
  // State to manage the collapsed status of the sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Define menu items based on user role
  const reporterMenuItems = [
    { id: "dashboard", label: "Dasbor", icon: LayoutDashboard },
    { id: "submit-report", label: "Buat Laporan", icon: FileText },
    { id: "history", label: "Riwayat Laporan", icon: History },
  ];

  const adminMenuItems = [
    { id: "dashboard", label: "Dasbor", icon: LayoutDashboard },
    { id: "manage-reports", label: "Kelola Laporan", icon: ClipboardList },
    { id: "manage-users", label: "Kelola Pengguna", icon: Users }, // Added Users for admin
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

  // Dynamic width classes
  const sidebarWidthClass = isCollapsed ? "w-20" : "w-64";
  const labelHiddenClass = isCollapsed ? "hidden" : "block";
  const iconMarginClass = isCollapsed ? "mr-0" : "mr-2";

  return (
    <aside 
      className={`border-r border-blue-400 bg-blue-900 flex flex-col h-full shadow-xl transition-all duration-300 ${sidebarWidthClass}`}
    >
      <div className={`p-4 ${isCollapsed ? 'justify-center' : 'justify-between'} flex items-center border-b border-blue-800`}>
        {/* Title / Logo slot - hidden when collapsed */}
        <h2 className={`text-blue-50 font-semibold text-lg ${labelHiddenClass}`}>App Nav</h2>
        
        {/* Toggle Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-blue-100 hover:bg-blue-800 hover:text-white"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "secondary" : "ghost"}
                className={`
                  w-full 
                  justify-start 
                  text-blue-100 
                  transition-colors 
                  duration-200 
                  ${isCollapsed ? 'p-3 h-auto' : 'px-4 py-2'}
                  ${
                    activeView === item.id 
                      ? "bg-blue-700 text-white hover:bg-blue-600" 
                      : "hover:bg-blue-800 hover:text-white"
                  }
                `}
                onClick={() => onNavigate(item.id)}
              >
                {/* Icon is always visible */}
                <Icon className={`h-5 w-5 ${iconMarginClass}`} />
                {/* Label is conditionally rendered */}
                <span className={labelHiddenClass}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
        
        {/* Separator is visible but adjusts margin when collapsed */}
        <Separator className="my-4 bg-blue-800" />
        
        <div className="space-y-1">
          {/* Settings Button */}
          <Button variant="ghost" className={`
            w-full 
            justify-start 
            text-blue-100 
            transition-colors 
            duration-200 
            ${isCollapsed ? 'p-3 h-auto' : 'px-4 py-2'}
            hover:bg-blue-800 hover:text-white
          `}>
            <Settings className={`h-5 w-5 ${iconMarginClass}`} />
            <span className={labelHiddenClass}>Pengaturan</span>
          </Button>
          
          {/* Logout Button */}
          <Button 
            variant="ghost" 
            className={`
              w-full 
              justify-start 
              text-blue-100 
              transition-colors 
              duration-200 
              ${isCollapsed ? 'p-3 h-auto' : 'px-4 py-2'}
              hover:bg-blue-800 hover:text-white
            `}
            onClick={onLogout}
          >
            <LogOut className={`h-5 w-5 ${iconMarginClass}`} />
            <span className={labelHiddenClass}>Keluar</span>
          </Button>
        </div>
      </nav>
    </aside>
  );
}