import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LoginPageProps {
  onLogin: (role: "reporter" | "admin" | "technician") => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const roleSelect = form.elements.namedItem("role") as HTMLSelectElement;
    const role = roleSelect.value as "reporter" | "admin" | "technician";
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-blue-400 bg-white shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div>
            <CardTitle className="text-blue-900">Sistem Pelaporan Kerusakan Fasilitas Kampus</CardTitle>
            <CardDescription className="text-blue-600">
              Masuk ke akun Anda untuk melanjutkan
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email.anda@kampus.ac.id" 
                className="border-blue-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-900">Kata Sandi</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="border-blue-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-blue-900">Masuk Sebagai</Label>
              <Select name="role" defaultValue="reporter" required>
                <SelectTrigger className="border-blue-200 bg-white focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reporter">Pelapor (Mahasiswa/Staf)</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="technician">Teknisi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Masuk
            </Button>
            
            <div className="text-center text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Lupa kata sandi?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}