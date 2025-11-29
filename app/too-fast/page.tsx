import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Timer, ArrowLeft, Home, ShieldAlert } from "lucide-react";

export default function RateLimitPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full border-blue-200 shadow-xl bg-white">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          {/* Icon Animasi */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-amber-200 blur opacity-50 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-200">
              <Timer className="w-10 h-10 text-amber-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-slate-200 shadow-sm">
                <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Whoa, Terlalu Cepat!
            </h1>
            <p className="text-slate-500 text-sm">
              Kami mendeteksi terlalu banyak permintaan dari perangkat Anda dalam waktu singkat.
            </p>
          </div>
        </CardHeader>

        <CardContent className="text-center pb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <p className="text-slate-700 font-medium text-sm">
              Mohon tunggu <span className="text-amber-600 font-bold">1 menit</span> sebelum mencoba mengirim laporan kembali.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Error Code: 429 (Too Many Requests)
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          
          <Link href="/" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Home className="mr-2 h-4 w-4" />
              Ke Beranda
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}