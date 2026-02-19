import { useState } from "react";
import { AppSidebar } from "../AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar
          userType="farmer"
          currentPage={currentPage}
          onNavigate={(page) => {
            console.log("Navigate to:", page);
            setCurrentPage(page);
          }}
          onLogout={() => console.log("Logout")}
        />
      </div>
    </SidebarProvider>
  );
}
