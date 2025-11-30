"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2, Image as ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { submitCompletionReport } from "@/lib/actions/technician";

import { saveMaintenanceDraft, getMaintenanceDraft, clearMaintenanceDraft } from "@/lib/actions/draft";

import { upload, ImageKitUploadNetworkError } from "@imagekit/next";
import config from "@/lib/config";

// Anda bisa integrasikan ImageKit di sini nanti
interface TaskUpdateFormProps {
  reportId: string;
}

export function TaskUpdateForm({ reportId }: TaskUpdateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); // Menyimpan path gambar
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Ref untuk input file tersembunyi
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. EFFECT: LOAD DRAFT (Saat Mount) ---
  useEffect(() => {
    const loadDraft = async () => {
      const draft = await getMaintenanceDraft(reportId);
      if (draft) {
        if (draft.description) setDescription(draft.description);
        if (draft.images && draft.images.length > 0) setUploadedFiles(draft.images);
        
        toast.info("Draft pekerjaan sebelumnya dipulihkan.");
        setLastSaved(new Date());
      }
    };
    loadDraft();
  }, [reportId]);

  // --- 2. EFFECT: AUTO SAVE (Debounce 1.5s) ---
  useEffect(() => {
    // Jangan simpan jika kosong sama sekali (awal load)
    if (!description && uploadedFiles.length === 0) return;

    setIsDraftSaving(true);

    const timer = setTimeout(async () => {
      await saveMaintenanceDraft(reportId, {
        description,
        images: uploadedFiles
      });
      
      setIsDraftSaving(false);
      setLastSaved(new Date());
    }, 1500);

    return () => clearTimeout(timer);
  }, [description, uploadedFiles, reportId]);
  
  const getAuthParams = async () => {
    try {
      const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`)
      }
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error(error);
      throw new Error("Autentikasi upload gagal");
    }
  };

// 2. Fungsi Handle Upload (Dipanggil saat user memilih file)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi Ukuran (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // A. Ambil Auth Params
      const { signature, expire, token, publicKey } = await getAuthParams();

      // B. Mulai Upload menggunakan SDK
      const response = await upload({
        file,
        fileName: file.name, // atau custom name: `report-${reportId}-${Date.now()}`
        useUniqueFileName: true,
        folder: "/laporan-teknisi", // Opsional: rapikan folder di ImageKit
        tags: ["report", reportId],
        publicKey,
        signature,
        expire,
        token,
        onProgress: (event) => {
          // Update progress bar
          if (event.total > 0) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      });

      // C. Sukses
      console.log("Upload Success:", response);
      if (response.filePath) {
        setUploadedFiles(prev => [...prev, response.filePath!]);
      }
      toast.success("Foto berhasil diunggah");

    } catch (error) {
      console.error("Upload Error:", error);
      if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Gagal terhubung ke jaringan upload");
      } else {
        toast.error("Gagal mengunggah foto. Silakan coba lagi.");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset input agar bisa upload file yang sama jika perlu
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 3. Hapus File dari List
  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitCompletionReport(
        reportId,
        description,
        uploadedFiles
      );

      if (result.success) {
        // HAPUS DRAFT SETELAH SUKSES
        await clearMaintenanceDraft(reportId);
        
        toast.success(result.message);
        router.push("/dashboard/technician");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Terjadi kesalahan sistem. Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* INDIKATOR STATUS DRAFT */}
      <div className="absolute top-0 right-0 -mt-8 text-xs text-slate-400 flex items-center gap-1">
        {isDraftSaving ? (
            <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Menyimpan draft...</span>
            </>
        ) : lastSaved ? (
            <>
                <Save className="w-3 h-3" />
                <span>Tersimpan {lastSaved.toLocaleTimeString()}</span>
            </>
        ) : null}
      </div>
      {/* INPUT DESKRIPSI */}
      <div className="space-y-2">
        <Label htmlFor="actions" className="text-blue-900">Detail Tindakan</Label>
        <Textarea 
          id="actions"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan perbaikan yang telah dilakukan..."
          className="border-blue-200 bg-white min-h-24 focus:border-blue-500"
          required
        />
      </div>

      {/* INPUT GAMBAR (Sama seperti kode Anda) */}
      <div className="space-y-2">
        <Label className="text-blue-900">Foto Bukti</Label>
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-blue-50 relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center py-2">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-blue-600 mb-1">Mengunggah... {uploadProgress}%</p>
              <div className="w-full max-w-xs h-2 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-blue-700 mb-2">Unggah bukti perbaikan</p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={() => fileInputRef.current?.click()}
              >
                Pilih File
              </Button>
            </>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {uploadedFiles.map((path, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="text-sm text-blue-900 truncate">
                    {path.split('/').pop()} {/* Ambil nama file saja */}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
          disabled={isSubmitting || isUploading} // Cegah submit jika sedang upload
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
            </>
          ) : "Selesaikan Tugas"}
        </Button>
      </div>
    </form>
  );
}