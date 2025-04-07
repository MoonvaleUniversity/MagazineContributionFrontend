import { useState, ReactNode } from "react";

import { MvThemeToggle } from "../components/MvThemeToggle";
import { MvAdminHeader } from "../components/Admin/MvAdminHeader";
import { MvAdminSidebar } from "../components/Admin/MvAdminSidebar/MvAdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <MvAdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ml-0 lg:ml-64`}
        style={{
          zIndex: 10, // Ensuring it's above the sidebar and header
        }}
      >
        <MvAdminHeader />
        <main className="p-6 overflow-y-scroll lg:h-[90vh] h-full lg:mt-0">
          {children}
        </main>
        <MvThemeToggle/>
      </div>
    </div>
  );
};

export default AdminLayout;
