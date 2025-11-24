import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ReporterSubmitFormProps {
  onNavigate: (view: string) => void;
}

export function ReporterSubmitForm({ onNavigate }: ReporterSubmitFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = () => {
    // Mock file upload
    setUploadedFiles([...uploadedFiles, `damage_photo_${uploadedFiles.length + 1}.jpg`]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Laporan berhasil dikirim!");
    setTimeout(() => onNavigate("dashboard"), 1500);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-blue-900">Buat Laporan Baru</h2>
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
            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="building" className="text-blue-900">Gedung</Label>
                <Select name="building" required>
                  <SelectTrigger className="border-blue-200 bg-white">
                    <SelectValue placeholder="Pilih gedung" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="library">Perpustakaan Utama</SelectItem>
                    <SelectItem value="science">Gedung Sains</SelectItem>
                    <SelectItem value="student-center">Pusat Mahasiswa</SelectItem>
                    <SelectItem value="dormitory-a">Asrama A</SelectItem>
                    <SelectItem value="dormitory-b">Asrama B</SelectItem>
                    <SelectItem value="engineering">Gedung Teknik</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room" className="text-blue-900">Ruang/Lantai/Area</Label>
                <Input 
                  id="room" 
                  placeholder="mis., Ruang 301, Lantai 2, Pintu Masuk Utama" 
                  className="border-blue-200 bg-white focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-blue-900">Tingkat Prioritas</Label>
              <Select name="priority" required>
                <SelectTrigger className="border-blue-200 bg-white">
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Tinggi - Memerlukan perhatian segera</SelectItem>
                  <SelectItem value="medium">Sedang - Harus diselesaikan segera</SelectItem>
                  <SelectItem value="low">Rendah - Dapat ditangani nanti</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-900">Deskripsi Kerusakan</Label>
              <Textarea 
                id="description"
                placeholder="Harap jelaskan kerusakan secara detail..."
                className="border-blue-200 bg-white min-h-32 focus:border-blue-500"
                required
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label className="text-blue-900">Unggah Foto</Label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-blue-700 mb-2">
                  Klik untuk mengunggah atau seret dan lepas
                </p>
                <p className="text-xs text-blue-500 mb-4">PNG, JPG hingga 10MB</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={handleFileUpload}
                >
                  Pilih File
                </Button>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <span className="text-sm text-blue-900">{file}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Kirim Laporan
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => onNavigate("dashboard")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}