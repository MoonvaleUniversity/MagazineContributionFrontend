
import { MvButton } from "../../MvButton";

// Header Component for Marketing Manager (styled like Student)
export const MvMarketingManagerHeader: React.FC = () => {
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const handleLogout = () => {
    // Remove user-related data
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
  
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('username');
  
    // Redirect to login page
    window.location.href = '/';
  };
  return (
    <header className="flex items-center justify-between px-6 py-4 text-black dark:text-white border-primary-500 bg-secondary-400 dark:bg-secondary-dark-600 border-b transition-all duration-300 w-full z-20">
      <div className="relative ml-12 flex items-center w-full max-w-md max-sm:max-w-sm">
      
      </div>

      <div className="flex items-center space-x-6">
       

       <div className="flex items-center space-x-3">
                <MvButton variant="primary" onClick={()=> {handleLogout()}} ><span className="">Logout</span></MvButton>
              
              </div>
      </div>
    </header>
  );
};
