'use server'

import { db } from "@/database/drizzle"; // Sesuaikan path db Anda
import { maintenance_reports, damage_reports } from "@/database/schema"; // Import kedua tabel
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Sesuaikan path auth
import { revalidatePath } from "next/cache";

export async function submitCompletionReport(
  reportId: string, // ID dari maintenance_reports
  actionDescription: string, 
  imageUrls: string[]
) {
  // 1. Cek Sesi
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // --- PERUBAHAN: Jalankan Berurutan (Tanpa Transaction) ---

    // Langkah 1: Update Laporan Maintenance (Tugas Teknisi)
    // Kita gunakan .returning() untuk mengambil ID Laporan Kerusakan (Parent)
    const [updatedTask] = await db.update(maintenance_reports)
      .set({
        technicianNotes: actionDescription, 
        images: imageUrls,
        status: "menunggu_verifikasi", // Update status teknisi
        completedAt: new Date(),
      })
      .where(eq(maintenance_reports.id, reportId))
      .returning({ 
        damageReportId: maintenance_reports.damageReportId 
      });

    if (!updatedTask) {
      return { success: false, message: "Tugas maintenance tidak ditemukan." };
    }

    // Langkah 2: Sinkronisasi Status Laporan Kerusakan (Parent)
    // Update status global agar admin/pelapor tahu statusnya berubah
    await db.update(damage_reports)
      .set({
        status: "menunggu_verifikasi",
        updatedAt: new Date()
      })
      .where(eq(damage_reports.id, updatedTask.damageReportId));

    // ---------------------------------------------------------

    // 4. Revalidate Path
    revalidatePath("/dashboard/technician");
    revalidatePath("/dashboard/admin"); 
    // Revalidate halaman detail spesifik juga agar cache bersih
    revalidatePath(`/dashboard/technician/tasks/${reportId}`);

    return { success: true, message: "Laporan dikirim untuk verifikasi!" };

  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Gagal menyimpan laporan." };
  }
}