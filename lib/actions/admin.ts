'use server'

import { db } from "@/database/drizzle";
import { damage_reports, maintenance_reports } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";

// 1. Action: Menugaskan Teknisi (Assign)
export async function assignTechnician(damageReportId: string, technicianId: number) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") return { success: false, message: "Unauthorized" };

  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if(!success) return redirect('/too-fast');

  try {
    // --- HAPUS db.transaction, JALANKAN BERURUTAN ---
    
    // 1. Buat Tiket Maintenance Baru
    await db.insert(maintenance_reports).values({
      damageReportId: damageReportId,
      technicianId: technicianId,
      status: "dalam_proses",
    });

    // 2. Update Status Laporan Utama
    await db.update(damage_reports)
      .set({ status: "dalam_proses", updatedAt: new Date() })
      .where(eq(damage_reports.id, damageReportId));

    // ------------------------------------------------

    revalidatePath("/dashboard/admin/reports");
    return { success: true, message: "Teknisi berhasil ditugaskan!" };
  } catch (error) {
    console.error("Assign Error:", error);
    return { success: false, message: "Gagal menugaskan teknisi." };
  }
}

// 2. Action: Verifikasi Penyelesaian (Verify)
export async function verifyReportCompletion(maintenanceId: string, damageReportId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") return { success: false, message: "Unauthorized" };

  try {
    // --- HAPUS db.transaction, JALANKAN BERURUTAN ---

    // 1. Tandai Maintenance Selesai & Terverifikasi
    await db.update(maintenance_reports)
      .set({ status: "selesai", verifiedAt: new Date() })
      .where(eq(maintenance_reports.id, maintenanceId));

    // 2. Tutup Laporan Kerusakan Utama
    await db.update(damage_reports)
      .set({ status: "selesai", updatedAt: new Date() })
      .where(eq(damage_reports.id, damageReportId));

    // ------------------------------------------------

    revalidatePath("/dashboard/admin/reports");
    return { success: true, message: "Laporan diverifikasi dan ditutup." };
  } catch (error) {
    console.error("Verify Error:", error);
    return { success: false, message: "Gagal memverifikasi laporan." };
  }
}