"use client";

import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { getSession, signIn } from "next-auth/react";
import { checkLoginRateLimit } from "@/lib/actions/auth"; // Pastikan path ini benar
import { toast } from "sonner";
import Link from "next/link"; // Gunakan Link Next.js, bukan <a>

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Hapus state error jika Anda sudah menggunakan toast, 
  // atau gunakan setError di dalam handleSubmit jika ingin pesan teks merah.
  // const [error, setError] = useState(""); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // setError(""); // Reset error jika ada

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // 1. Cek Rate Limit (Server Action)
      await checkLoginRateLimit();

      // 2. Login Credential (Client Side)
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Email atau kata sandi salah");
        // setError("Email atau kata sandi salah"); // Opsional
      } else {
        // 3. Ambil Session untuk Cek Role
        const session = await getSession();
        const role = session?.user?.role;

        toast.success("Login berhasil!");

        if (role) {
          router.push(`/dashboard/${role}`);
        } else {
          router.push("/dashboard");
        }
        
        router.refresh(); // Update komponen server
      }

    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  }; // <--- TUTUP handleSubmit DI SINI

  // <--- RETURN JSX HARUS DI LUAR handleSubmit
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            {/* Jika ingin inline error, uncomment baris bawah */}
            {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
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
              <Link href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                Lupa kata sandi?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}