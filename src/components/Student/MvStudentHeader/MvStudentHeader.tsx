
import { MvButton } from "../../MvButton";
import { getLogout } from "../../../app/MvApi";
import { MvUrl } from "../../../app/MvUrl";

// Header Component for Student
export const MvStudentHeader: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleLogout = async () => {
    
   try{
        await getLogout(MvUrl.LOGOUT); 

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
    <header
      className={`flex items-center justify-between px-6 py-4 text-black dark:text-white  border-primary-500 bg-secondary-400 dark:bg-secondary-dark-600 dark:border-primary-dark-500  border-b transition-all duration-300 w-full z-20`}
    >
      {/* Search Bar (optional for student, can be removed if not needed) */}
      <div className="relative ml-12 flex items-center w-full max-w-md max-sm:max-w-sm">
      
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6">
        {/* Notification icon (if you want to keep it for students, you can adjust the badge) */}
      

        <div className="flex items-center space-x-3">
          <MvButton variant="primary" onClick={()=> {handleLogout()}} ><span className="">Logout</span></MvButton>
        
        </div>
      </div>
    </header>
  );
};
