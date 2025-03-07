import { useState, ReactNode } from "react";
import { MvThemeToggle } from "../components/MvThemeToggle";
import { MvMarketingCoordinatorSidebar } from "../components/MarketingCoordinator/MarketingCoordinatorsidebar/MarketingCoordinatorsidebar";
import { MvMarketingCoordinatorHeader } from "../components/MarketingCoordinator/MarketingCoordinatorheader/MarketingCoordinatorheader";

interface MarketingCoordinatorLayoutProps {
  children: ReactNode;
}

const MarketingCoordinatorLayout: React.FC<MarketingCoordinatorLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <MvMarketingCoordinatorSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300 ml-0 lg:ml-64 z-10">
        <MvMarketingCoordinatorHeader />
        <main className="p-6 overflow-y-scroll lg:h-[90vh] h-full lg:mt-0">
          {children}
        </main>
        <MvThemeToggle />
      </div>
    </div>
  );
};

export default MarketingCoordinatorLayout;
