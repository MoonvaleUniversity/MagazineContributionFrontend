import { useState, ReactNode } from "react";

import { MvThemeToggle } from "../components/MvThemeToggle";
import { MvStudentHeader } from "../components/Student/MvStudentHeader";
import { MvStudentSidebar } from "../components/Student/MvStudentSidebar";

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <MvStudentSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ml-0 lg:ml-64`}
        style={{
          zIndex: 10, // Ensuring it's above the sidebar and header
        }}
      >
        <MvStudentHeader />
        <main className="p-6 max-w-screen overflow-y-scroll lg:h-[90vh] h-full lg:mt-0">
          {children}
        </main>
        <MvThemeToggle/>
      </div>
    </div>
  );
};

export default StudentLayout;
