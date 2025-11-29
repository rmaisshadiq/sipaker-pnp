import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/drizzle";
import { damage_reports, maintenance_reports, users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AdminReportsClient } from "@/components/AdminReportsClient";

// Alias table users untuk teknisi dan pelapor agar tidak bentrok saat join
import { alias } from "drizzle-orm/pg-core";

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") redirect("/login");

  const technicianTable = alias(users, "technician");
  const reporterTable = alias(users, "reporter");

  // 1. Fetch Laporan (Complex Join)
  const reportsData = await db
    .select({
      id: damage_reports.id,
      title: damage_reports.title,
      location: damage_reports.location,
      status: damage_reports.status, // Status utama
      priority: damage_reports.priority,
      createdAt: damage_reports.createdAt,
      
      // Info Pelapor
      reporterName: reporterTable.name,
      
      // Info Maintenance (Jika sudah di-assign)
      maintenanceId: maintenance_reports.id,
      technicianName: technicianTable.name,
      technicianNotes: maintenance_reports.technicianNotes,
      completionImages: maintenance_reports.images, // Foto bukti selesai
    })
    .from(damage_reports)
    .leftJoin(reporterTable, eq(damage_reports.reporterId, reporterTable.id))
    .leftJoin(maintenance_reports, eq(damage_reports.id, maintenance_reports.damageReportId))
    .leftJoin(technicianTable, eq(maintenance_reports.technicianId, technicianTable.id))
    .orderBy(desc(damage_reports.createdAt));

  // 2. Fetch Daftar Teknisi (Untuk Dropdown Assign)
  const technicians = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(eq(users.role, "technician"));

  return (
    <div className="p-6">
      <AdminReportsClient 
        reports={reportsData} 
        technicians={technicians} 
      />
    </div>
  );
}