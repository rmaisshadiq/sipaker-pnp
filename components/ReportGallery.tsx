"use client";

import Image from "next/image";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogTitle 
} from "@/components/ui/dialog";

// 1. Definisikan Loader ImageKit
// Fungsi ini mengubah path "/foto.jpg" menjadi URL lengkap ImageKit dengan parameter resize
const imageKitLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  // Hapus slash di awal path jika ada (agar tidak double slash)
  const path = src.startsWith("/") ? src.slice(1) : src;
  
  // Ambil Endpoint dari ENV
  let urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";
  // Hapus slash di akhir endpoint jika ada
  if (urlEndpoint.endsWith("/")) urlEndpoint = urlEndpoint.slice(0, -1);

  // Buat parameter transformasi (resize otomatis sesuai lebar layar)
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  
  // Format URL: https://ik.imagekit.io/id/path?tr=w-300,q-80
  return `${urlEndpoint}/${path}?tr=${params.join(",")}`;
};

interface ReportGalleryProps {
  images: string[] | null;
}

export function ReportGallery({ images }: ReportGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="col-span-3 aspect-square bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 text-xs">
        Tidak ada foto
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((path, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative cursor-zoom-in hover:opacity-90 transition-opacity">
              {/* Gunakan komponen Image bawaan Next.js dengan Loader ImageKit.
                  'fill' membuat gambar mengisi kotak parent (aspect-square).
                  'sizes' memberi tahu browser seberapa besar gambar yang harus didownload.
              */}
              <Image
                loader={imageKitLoader}
                src={path}
                alt={`Bukti Kerusakan ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 150px" // Hemat kuota: Download kecil di HP
              />
            </div>
          </DialogTrigger>
          
          <DialogContent className="max-w-3xl bg-transparent border-none shadow-none p-0 flex justify-center items-center">
             {/* Container untuk gambar full screen */}
             <DialogTitle className="sr-only">
                Detail Bukti Foto ke-{index + 1}
             </DialogTitle>
             <div className="relative w-[90vw] h-[80vh] md:w-[80vw] md:h-[80vh] rounded-md overflow-hidden">
                <Image
                  loader={imageKitLoader}
                  src={path}
                  alt={`Bukti Full ${index + 1}`}
                  fill
                  className="object-contain" // Agar gambar utuh tidak terpotong
                  quality={90} // Kualitas tinggi saat di-zoom
                />
             </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}