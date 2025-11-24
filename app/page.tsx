'use client';

import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Siderbar";
import { ReporterDashboard } from "./components/ReporterDashboard";
import { ReporterSubmitForm } from "./components/ReporterSubmitForm";
import { ReporterHistory } from "./components/ReporterHistory";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminManagement } from "./components/AdminManagement";
import { TechnicianDashboard } from "./components/TechnicianDashboard";
import { TechnicianReportDetail } from "./components/TechnicianReportDetail";
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
      ? "Alice Cooper" 
      : userRole === "admin" 
      ? "Admin User"
      : "John Smith";

  const userRoleLabel = 
    userRole === "reporter" 
      ? "Mahasiswa" 
      : userRole === "admin" 
      ? "Administrator"
      : "Teknisi";

  // Show login page if no user role
  if (!userRole) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

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
          userRole={userRole}
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