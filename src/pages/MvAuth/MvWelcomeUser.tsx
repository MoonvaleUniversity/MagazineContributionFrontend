import { Link } from "react-router-dom";
import { MvButton } from "../../components/MvButton";
import MvRoutes from "../../app/MvRoutes";
import { User } from "../../app/MvObjects/user";
import { MvThemeToggle } from "../../components/MvThemeToggle";





export const WelcomeUser = () => {
   // Properly parse user data from localStorage
   const userData = localStorage.getItem("userData")|| sessionStorage.getItem("userData");
   const user: User = userData ? JSON.parse(userData) : null;
 
   if (!user) {
     return <div>Loading user data...</div>;
   }
   const getDashboardRoute = () => {
    switch(user.role) {
      case 'Student':
        return MvRoutes.STUDENTS.DASHBOARD;
      case 'Admin':
        return MvRoutes.ADMIN.DASHBOARD;
      case 'Marketing Manager':
        return MvRoutes.MARKET_MANAGER.DASHBOARD;
      case 'Marketing Coordinator':
        return MvRoutes.MARKET_COORDINATOR.DASHBOARD;
      default:
        return MvRoutes.DASHBOARD;
    }
  };

    const getRoleContent = () => {
    const baseContent = {
      title: `Welcome, ${user.name}!`,
      description: "You're logged in as:",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )
    };

    switch(user.role) {
      case 'Student':
        return {
          ...baseContent,
          title: `Welcome Student, ${user.name}!`,
          description: "Ready to submit your next magazine contribution?",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          )
        };
      case 'Admin':
        return {
          ...baseContent,
          title: `Administrator Dashboard, ${user.name}`,
          description: "Manage university magazine submissions and users",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 110-2h12V4H4zm3 2h2v2H7V6zm0 4h2v2H7v-2zm0 4h2v2H7v-2z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'Marketing Manager':
        return {
          ...baseContent,
          title: `Marketing Manager Portal, ${user.name}`,
          description: "Oversee magazine publications and campaigns",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 110-2h12V4H4zm3 2h2v2H7V6zm0 4h2v2H7v-2zm0 4h2v2H7v-2z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'Marketing Coordinator':
        return {
          ...baseContent,
          title: `Coordinator Dashboard, ${user.name}`,
          description: "Manage student submissions and faculty coordination",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          )
        };
      default:
        return baseContent;
    }
  };

  const roleContent = getRoleContent();
 

  return (
   
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-4">
              {roleContent.icon}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center">
              {roleContent.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 text-center">
              {roleContent.description}
            </p>

            <div className="w-full max-w-md space-y-4 mt-8">
              <div className="flex justify-between p-4 bg-green-50 dark:bg-gray-600 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Role:</span>
                <span className="font-medium text-purple-600 dark:text-purple-300">
                  {user.role}
                </span>
              </div>
              
              <div className="flex justify-between p-4 bg-purple-50 dark:bg-gray-600 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Email:</span>
                <span className="font-medium text-green-600 dark:text-green-300">
                  {user.email}
                </span>
              </div>
              
              <div className="flex justify-between p-4 bg-green-50 dark:bg-gray-600 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Account Created:</span>
                <span className="font-medium text-purple-600 dark:text-purple-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Link to={getDashboardRoute()} className="w-full max-w-md mt-8">
              <MvButton
                variant="primary"
                className="w-full py-4 text-lg bg-gradient-to-r from-green-400 to-purple-500 hover:from-green-500 hover:to-purple-600"
              >
                Go to Dashboard
              </MvButton>
            </Link>
          </div>
        </div>
      </div>
    <MvThemeToggle/>
    </div>
  );
};