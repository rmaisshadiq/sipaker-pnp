import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  userName: string;
  userRole: string;
}

export function Header({ userName, userRole }: HeaderProps) {
  return (
    <header className="h-16 border-b border-blue-400 bg-white flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-blue-900">Sistem Pelaporan Kerusakan Fasilitas Kampus</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
          <Bell className="h-5 w-5 text-blue-600" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 hover:bg-blue-600">
            3
          </Badge>
        </Button>
        
        <div className="flex items-center gap-2 border-l border-blue-400 pl-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-900">{userName}</p>
            <p className="text-xs text-blue-600">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}