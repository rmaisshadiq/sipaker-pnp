"use client"; // 1. Wajib jadi Client Component karena pakai hook

import { Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react"; // 2. Import hooks

export function Header() {
  // 3. Ambil data session langsung di sini
  const { data: session } = useSession();

  // 4. Fallback data (mencegah error jika session belum load/null)
  const userName = session?.user?.name || "Pengguna";
  const userRole = session?.user?.role || "Guest";

  return (
    <header className="h-16 border-b border-blue-400 bg-white flex items-center justify-between px-6 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-blue-900 font-bold text-lg hidden md:block">
            Sistem Pelaporan Kerusakan Fasilitas Kampus
        </h1>
        {/* Tampilan Mobile Singkat */}
        <h1 className="text-blue-900 font-bold text-lg md:hidden">
            SIPAKER
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notifikasi */}
        <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
          <Bell className="h-5 w-5 text-blue-600" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 hover:bg-blue-600">
            3
          </Badge>
        </Button>
        
        {/* Profil User */}
        <div className="flex items-center gap-3 border-l border-blue-400 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-blue-900">{userName}</p>
            <p className="text-xs text-blue-600 uppercase font-semibold">
                {userRole}
            </p>
          </div>

          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 border border-blue-200">
             {/* Jika ada foto profil, gunakan Image, jika tidak gunakan Icon */}
            <User className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      </div>
    </header>
  );
}