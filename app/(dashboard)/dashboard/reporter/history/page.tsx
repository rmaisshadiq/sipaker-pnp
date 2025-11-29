import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Sesuaikan path
import { db } from "@/database/drizzle";
import { damage_reports, maintenance_reports, users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ReporterHistoryClient } from "@/components/ReporterHistoryClient";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) {
    redirect("/login");
  }

  const reporterId = parseInt(session.user.id);

  // FETCH DATA:
  // Kita melakukan JOIN dari damage_reports -> maintenance_reports -> users
  // Tujuannya: Untuk mendapatkan nama teknisi yang ditugaskan (jika ada)
  const reports = await db
    .select({
      id: damage_reports.id,
      title: damage_reports.title,
      location: damage_reports.location,
      description: damage_reports.description,
      status: damage_reports.status,
      priority: damage_reports.priority,
      images: damage_reports.images,
      createdAt: damage_reports.createdAt,
      // Ambil nama teknisi dari tabel users (via maintenance_reports)
      technicianName: users.name, 
    })
    .from(damage_reports)
    .leftJoin(maintenance_reports, eq(damage_reports.id, maintenance_reports.damageReportId))
    .leftJoin(users, eq(maintenance_reports.technicianId, users.id))
    .where(eq(damage_reports.reporterId, reporterId))
    .orderBy(desc(damage_reports.createdAt));

  return <ReporterHistoryClient initialData={reports} />;
}