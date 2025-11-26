"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook untuk cek URL aktif
import { signOut } from "next-auth/react"; // Logout langsung
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Users, 
  Settings, 
  LogOut,
  ClipboardList,
  Wrench,
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // Utilitas standar shadcn untuk merge class

interface SidebarProps {
  userRole: string; // Kita hanya butuh role, navigasi diurus URL
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname(); // Ambil URL saat ini

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Definisi Menu berdasarkan Role dengan URL tujuan (href)
  const menuItems = {
    reporter: [
      { href: "/dashboard/reporter", label: "Dasbor", icon: LayoutDashboard },
      { href: "/dashboard/reporter/create", label: "Buat Laporan", icon: FileText },
      { href: "/dashboard/reporter/history", label: "Riwayat", icon: History },
    ],
    admin: [
      { href: "/dashboard/admin", label: "Dasbor", icon: LayoutDashboard },
      { href: "/dashboard/admin/reports", label: "Kelola Laporan", icon: ClipboardList },
      { href: "/dashboard/admin/users", label: "Kelola Pengguna", icon: Users },
    ],
    technician: [
      { href: "/dashboard/technician", label: "Dasbor", icon: LayoutDashboard },
      { href: "/dashboard/technician/tasks", label: "Tugas Saya", icon: Wrench },
    ]
  };

  // Pilih menu berdasarkan role, fallback ke array kosong jika role tidak dikenali
  const currentMenuItems = menuItems[userRole as keyof typeof menuItems] || [];

  return (
    <aside 
      className={cn(
        "border-r border-blue-400 bg-blue-900 flex flex-col h-screen shadow-xl transition-all duration-300 sticky top-0 left-0 z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header Sidebar */}
      <div className={cn(
        "p-4 flex items-center border-b border-blue-800 h-16",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <h2 className="text-blue-50 font-bold text-xl tracking-wide">
            SIPAKER
          </h2>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-blue-100 hover:bg-blue-800 hover:text-white h-8 w-8"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      {/* Menu Navigasi */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-2">
        {currentMenuItems.map((item) => {
          const Icon = item.icon;
          // Cek apakah URL saat ini diawali dengan href menu ini
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-blue-100 transition-all duration-200",
                  isCollapsed ? "px-0 justify-center h-12" : "px-4 py-2",
                  isActive 
                    ? "bg-blue-700 text-white hover:bg-blue-600 shadow-md" 
                    : "hover:bg-blue-800 hover:text-white"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} className={cn(isCollapsed ? "mr-0" : "mr-3")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar (Settings & Logout) */}
      <div className="p-3 mt-auto mb-4">
        <Separator className="my-2 bg-blue-800" />
        
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full text-blue-100 hover:bg-blue-800 hover:text-white",
              isCollapsed ? "justify-center px-0" : "justify-start px-4"
            )}
          >
            <Settings size={20} className={cn(isCollapsed ? "mr-0" : "mr-3")} />
            {!isCollapsed && <span>Pengaturan</span>}
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "w-full text-red-300 hover:bg-red-900/30 hover:text-red-200",
              isCollapsed ? "justify-center px-0" : "justify-start px-4"
            )}
          >
            <LogOut size={20} className={cn(isCollapsed ? "mr-0" : "mr-3")} />
            {!isCollapsed && <span>Keluar</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}