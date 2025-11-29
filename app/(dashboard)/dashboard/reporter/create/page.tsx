"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

// Import Server Action & ImageKit
import { createDamageReport } from "@/lib/actions/reporter";
import { upload } from "@imagekit/next";

export default function ReporterSubmitForm() {
  const router = useRouter();
  
  // Form States
  const [title, setTitle] = useState("");
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const [priority, setPriority] = useState("menengah");
  const [description, setDescription] = useState("");
  
  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Image Data
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. HANDLE IMAGEKIT UPLOAD ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // Max 10MB
      toast.error("Ukuran file maksimal 10MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Fetch Auth Params
      const authRes = await fetch("/api/auth/imagekit");
      if (!authRes.ok) throw new Error("Gagal auth upload");
      const { signature, expire, token, publicKey } = await authRes.json();

      // Upload ke ImageKit
      const response = await upload({
        file,
        fileName: file.name,
        useUniqueFileName: true,
        folder: "/laporan-kerusakan",
        publicKey,
        signature,
        expire,
        token,
        onProgress: (evt) => {
          if (evt.total > 0) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      });

      if (response.filePath) {
        setUploadedFiles(prev => [...prev, response.filePath!]); 
      }
      toast.success("Foto berhasil diunggah");

    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // --- 2. HANDLE SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedFiles.length === 0) {
        toast.warning("Mohon sertakan minimal satu foto bukti kerusakan.");
        return;
    }

    setIsSubmitting(true);

    try {
      // Gabungkan Gedung + Ruang jadi Location
      const fullLocation = `${building} - ${room}`;

      // Panggil Server Action
      const result = await createDamageReport({
        title,
        description,
        location: fullLocation,
        priority,
        images: uploadedFiles
      });

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/reporter"); // Redirect ke dashboard
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim laporan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Buat Laporan Baru</h2>
        <p className="text-blue-600">Isi formulir di bawah ini untuk melaporkan kerusakan fasilitas</p>
      </div>

      <Card className="border-blue-400 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-blue-900">Formulir Laporan Kerusakan</CardTitle>
          <CardDescription className="text-blue-600">
            Harap berikan informasi detail tentang kerusakan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Judul (Wajib utk Schema) */}
            <div className="space-y-2">
                <Label htmlFor="title" className="text-blue-900">Judul Laporan</Label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: AC Bocor di Ruang Rapat" 
                  className="border-blue-200 bg-white focus:border-blue-500"
                  required
                />
            </div>

            {/* Location Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="building" className="text-blue-900">Gedung</Label>
                <Select onValueChange={setBuilding} required>
                  <SelectTrigger className="border-blue-200 bg-white">
                    <SelectValue placeholder="Pilih gedung" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perpustakaan Utama">Perpustakaan Utama</SelectItem>
                    <SelectItem value="Gedung Sains">Gedung Sains</SelectItem>
                    <SelectItem value="Pusat Mahasiswa">Pusat Mahasiswa</SelectItem>
                    <SelectItem value="Asrama A">Asrama A</SelectItem>
                    <SelectItem value="Gedung Teknik">Gedung Teknik</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room" className="text-blue-900">Ruang/Lantai/Area</Label>
                <Input 
                  id="room" 
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="mis., Ruang 301, Lantai 2" 
                  className="border-blue-200 bg-white focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-blue-900">Tingkat Prioritas</Label>
              <Select onValueChange={setPriority} defaultValue="menengah"> {/* Default juga ubah */}
                <SelectTrigger className="border-blue-200 bg-white">
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  {/* UBAH VALUE DISINI MENJADI BAHASA INDONESIA (LOWERCASE) */}
                  <SelectItem value="tinggi">Tinggi - Memerlukan perhatian segera</SelectItem>
                  <SelectItem value="menengah">Sedang - Harus diselesaikan segera</SelectItem>
                  <SelectItem value="rendah">Rendah - Dapat ditangani nanti</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-900">Deskripsi Kerusakan</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Harap jelaskan kerusakan secara detail..."
                className="border-blue-200 bg-white min-h-32 focus:border-blue-500"
                required
              />
            </div>

            {/* Photo Upload (ImageKit) */}
            <div className="space-y-2">
              <Label className="text-blue-900">Foto Kerusakan (Wajib)</Label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 relative">
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />

                {isUploading ? (
                   <div className="flex flex-col items-center">
                     <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                     <p className="text-sm text-blue-600">Mengunggah... {uploadProgress}%</p>
                   </div>
                ) : (
                    <>
                        <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-blue-700 mb-2">Klik tombol di bawah untuk unggah</p>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Pilih File Foto
                        </Button>
                    </>
                )}
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="text-sm text-blue-900 truncate max-w-[250px]">
                            {file.split('/').pop()}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => router.push("/dashboard/reporter")}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...
                    </>
                ) : "Kirim Laporan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}