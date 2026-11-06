import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardThemeProvider } from "@/components/dashboard/dashboard-theme";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardThemeProvider>
      <div className="dashboard-app">
        <DashboardSidebar />
        <div className="dashboard-main">{children}</div>
      </div>
    </DashboardThemeProvider>
  );
}
