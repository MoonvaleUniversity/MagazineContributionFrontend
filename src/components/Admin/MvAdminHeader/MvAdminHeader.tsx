

import { MvButton } from "../../MvButton";
import { getLogout } from "../../../app/MvApi";
import { MvUrl } from "../../../app/MvUrl";

export const MvAdminHeader: React.FC = () => {

  const handleLogout = async () => {

    try{
      await getLogout(MvUrl.LOGOUT); 
      // Remove user-related data
      localStorage.removeItem('userData');
  localStorage.removeItem('userToken');
  localStorage.removeItem('username');

  sessionStorage.removeItem('userData');
  sessionStorage.removeItem('userToken');
  sessionStorage.removeItem('username'); 
  sessionStorage.removeItem('viewed') 

      console.log("Successful logout");
    }catch (error) {
      console.error('Logout failed:', error);
    }

  
    // Redirect to login page
    window.location.href = '/';
  };
  return (
    <header className="flex items-center justify-between px-6 py-4 text-black dark:text-white border-b border-primary-500 bg-secondary-400 dark:bg-secondary-dark-600 transition-all duration-300 w-full z-20">
      {/* Logo and Title */}  
      <div className="flex items-center space-x-4">
         
        
        </div>
      {/* Icons */}
      <div className="flex items-center space-x-6">
      

        <div className="flex items-center space-x-3">
                 <MvButton variant="primary" onClick={()=> {handleLogout()}} ><span className="">Logout</span></MvButton>
               
               </div>
      </div>
    </header>
  );
};
