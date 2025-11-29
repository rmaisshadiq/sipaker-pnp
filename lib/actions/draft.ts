'use server'

// Pastikan path ini benar sesuai setup Upstash Anda
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import redis from "@/database/redis";

// Tipe data Draft
interface ReportDraft {
  title: string;
  description: string;
  location: string; // building + room
  priority: string;
  images: string[];
}

interface MaintenanceDraft {
  description: string;
  images: string[];
}

// 1. Simpan Draft
export async function saveReportDraft(data: ReportDraft) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  const KEY = `draft:report:${session.user.id}`;
  
  // Simpan ke Redis, Expire dalam 24 jam (86400 detik)
  // Kita stringify object karena Redis menyimpan string
  await redis.set(KEY, JSON.stringify(data), { ex: 86400 });
}

// 2. Ambil Draft
export async function getReportDraft() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const KEY = `draft:report:${session.user.id}`;
  const data = await redis.get<ReportDraft>(KEY); // Upstash otomatis parse JSON jika generik dipasang
  
  return data;
}

// 3. Hapus Draft (Dipanggil setelah sukses submit ke DB utama)
export async function clearReportDraft() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  const KEY = `draft:report:${session.user.id}`;
  await redis.del(KEY);
}

// 1. Simpan Draft Teknisi (Key unik berdasarkan User ID + Report ID)
export async function saveMaintenanceDraft(reportId: string, data: MaintenanceDraft) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  // Key spesifik: draft:tech:{userId}:{reportId}
  const KEY = `draft:tech:${session.user.id}:${reportId}`;
  
  await redis.set(KEY, JSON.stringify(data), { ex: 86400 }); // Expire 24 jam
}

// 2. Ambil Draft Teknisi
export async function getMaintenanceDraft(reportId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const KEY = `draft:tech:${session.user.id}:${reportId}`;
  const data = await redis.get<MaintenanceDraft>(KEY);
  
  return data;
}

// 3. Hapus Draft Teknisi
export async function clearMaintenanceDraft(reportId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  const KEY = `draft:tech:${session.user.id}:${reportId}`;
  await redis.del(KEY);
}