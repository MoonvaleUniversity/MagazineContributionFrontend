import { useState, ReactNode } from "react";
import { MvThemeToggle } from "../components/MvThemeToggle";
import { MvMarketingManagerHeader } from "../components/Marketing Manager/MvManagerHeader";
import { MvMarketingManagerSidebar } from "../components/Marketing Manager/MvManagerSideBar";

interface MarketingManagerLayoutProps {
  children: ReactNode;
}

const MarketingManagerLayout: React.FC<MarketingManagerLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <MvMarketingManagerSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300 ml-0 lg:ml-64 z-10">
        <MvMarketingManagerHeader />
        <main className="p-6 overflow-y-scroll lg:h-[90vh] h-full lg:mt-0">
          {children}
        </main>
        <MvThemeToggle />
      </div>
    </div>
  );
};

export default MarketingManagerLayout;
