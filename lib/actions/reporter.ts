'use server'

import { db } from "@/database/drizzle";
import { damage_reports } from "@/database/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Sesuaikan path
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";

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

  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if(!success) return redirect('/too-fast');

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