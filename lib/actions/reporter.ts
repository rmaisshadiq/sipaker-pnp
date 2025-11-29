'use server'

import { db } from "@/database/drizzle";
import { damage_reports } from "@/database/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Sesuaikan path
import { revalidatePath } from "next/cache";

type PriorityType = "rendah" | "menengah" | "tinggi";

interface CreateReportParams {
  title: string;
  description: string;
  location: string;
  priority: string;
  images: string[];
}

export async function createDamageReport(data: CreateReportParams) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) {
    return { success: false, message: "Anda harus login untuk melapor." };
  }

  try {
    await db.insert(damage_reports).values({
      reporterId: parseInt(session.user.id),
      title: data.title,
      description: data.description,
      location: data.location,
      priority: data.priority as PriorityType,
      images: data.images,
      status: 'menunggu',
    });

    revalidatePath("/dashboard/reporter");
    return { success: true, message: "Laporan berhasil dikirim!" };

  } catch (error) {
    console.error("Gagal buat laporan:", error);
    return { success: false, message: "Gagal menyimpan laporan ke database." };
  }
}