// Header yang kita buat sebelumnya
import { authOptions } from "@/auth";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Statis di Kiri */}
      <Sidebar userRole={session.user.role} />

      {/* Konten Utama di Kanan */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header di Atas */}
        <Header />

        {/* Halaman (Page) di Bawahnya */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}