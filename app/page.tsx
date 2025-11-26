'use client';

import { useState } from "react";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { ReporterDashboard } from "./(dashboard)/reporter/page";
import { ReporterSubmitForm } from "./(dashboard)/reporter/submit/page";
import { ReporterHistory } from "./(dashboard)/reporter/history/page";
import { AdminDashboard } from "./(dashboard)/admin/page";
import { AdminManagement } from "../features/admin/components/AdminManagement";
import { TechnicianDashboard } from "./(dashboard)/technician/page";
import { TechnicianReportDetail } from "./(dashboard)/technician/reports/[id]/page";
import { Toaster } from "@/components/ui/sonner";

type UserRole = "reporter" | "admin" | "technician" | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [activeView, setActiveView] = useState("dashboard");

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setActiveView("dashboard");
  };

  const handleNavigate = (view: string) => {
    setActiveView(view);
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveView("dashboard");
  };

  // User names based on role
  const userName = 
    userRole === "reporter" 
      ? "Rafi Maisshadiq" 
      : userRole === "admin" 
      ? "Admin"
      : "Rafi Maisshadiq";

  const userRoleLabel = 
    userRole === "reporter" 
      ? "Mahasiswa" 
      : userRole === "admin" 
      ? "Administrator"
      : "Teknisi";

  // Render content based on role and active view
  const renderContent = () => {
    if (userRole === "reporter") {
      switch (activeView) {
        case "submit-report":
          return <ReporterSubmitForm onNavigate={handleNavigate} />;
        case "history":
          return <ReporterHistory />;
        default:
          return <ReporterDashboard onNavigate={handleNavigate} />;
      }
    } else if (userRole === "admin") {
      switch (activeView) {
        case "manage-reports":
          return <AdminManagement />;
        default:
          return <AdminDashboard />;
      }
    } else if (userRole === "technician") {
      switch (activeView) {
        case "assigned-reports":
          return <TechnicianReportDetail onNavigate={handleNavigate} />;
        default:
          return <TechnicianDashboard onNavigate={handleNavigate} />;
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header userName={userName} userRole={userRoleLabel} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          activeView={activeView} 
          onNavigate={handleNavigate} 
          userRole="reporter"
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-auto bg-blue-50">
          {renderContent()}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}