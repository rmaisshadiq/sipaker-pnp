"use client";

import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { signInWithCredentials } from "@/lib/actions/auth";
import { getSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signInWithCredentials({ email, password });

    if (res.success) {
      const session = await getSession();
      const role = session?.user?.role;

      if (role) {
         router.push(`/dashboard/${role}`);
      } else {
         router.push("/dashboard");
      }
      router.refresh();

    } else {
      setError(typeof res?.error === "string" ? res.error : "Login Gagal: Cek email atau password");
      setIsLoading(false)
    }
  }

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
                name="email"
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
                name="password"
                type="password" 
                placeholder="••••••••" 
                className="border-blue-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-500">Login gagal! Silahkan cek email dan password kembali.</p>}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading} // Mencegah double click
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
            )}
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