import React, { ChangeEvent, useEffect, useState } from "react";
import { MvCheckbox, MvInput, MvPasswordInput } from "../../components/MvInput";
import { MvButton } from "../../components/MvButton";
import { MvThemeToggle } from "../../components/MvThemeToggle";
import { loginUser } from "../../services/AuthService";
import LoginPostData from "../../app/Types/Auth/LoginPostData";
import { ApiError } from "../../app/MvApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MvRoutes from "../../app/MvRoutes";
import { LoginResponse } from "../../app/Types/Auth/loginResponse";
import { MvLoader } from "../../components/MvLoader";
import { logo_dark, logo_light } from "../../app/MvConstants";
import { MvModal } from "../../components/MvModal";


const Login: React.FC = () => {
  const [error, setError] = useState<ApiError>();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [loginFormData, setLoginFormData] = useState<LoginPostData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setShowRegistrationSuccess(true);
      // Clear the state to prevent showing message on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({}); // Reset error message

    // Basic validation
    if (!loginFormData.email || !loginFormData.password) {
      setError({ message: "Email and password are required." });
      return;
    }

    try {
      setLoading(true);
      const response: LoginResponse = await loginUser(loginFormData);

      // Check if the response message is "Login success."
      if (response.success) {
          
           const isNewUser = document.cookie.includes('newuser=true');
        
          
           if (isNewUser) {
             document.cookie = 'newuser=; max-age=0';
           }
   
        if (rememberMe) {
          localStorage.setItem("userToken", response.data.token);
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem("userToken", response.data.token);
          sessionStorage.setItem(
            "userData",
            JSON.stringify(response.data.user)
          );
        }
       
        const userRole = response.data.user.role;
        if (isNewUser) {
          navigate(MvRoutes.WELCOME_USER);
        } else {  // Assuming role is in response data
        if (userRole === "Admin") {
          navigate(MvRoutes.ADMIN.DASHBOARD); // Example route for Admin
        } else if (userRole === "Student") {
          navigate(MvRoutes.STUDENTS.DASHBOARD); // Example route for Student
        } else if (userRole === "Marketing Manager") {
          navigate(MvRoutes.MARKET_MANAGER.DASHBOARD); // Example route for Student
        } else if (userRole === "Marketing Coordinator") {
          navigate(MvRoutes.MARKET_COORDINATOR.DASHBOARD
            
          ); // Example route for Student
        } else {
          navigate(MvRoutes.GUEST.DASHBOARD); // Default route
        }
      }
      } 

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {  
      setError({ message: error?.message || "An unknown error occurred." });
      console.error(error);
      if (error?.response.data.message === "You need to verify your email first.") {
        navigate(MvRoutes.EMAIL_VERIFY, {
          state: { email: loginFormData.email },
        });
      }
      else if (error?.message === "Request failed with status code 500") {
        setError({message: "Please check your email and try again"});
      }
      
      else if (error?.message === "Request failed with status code 401"){
         if (error?.response.data.message === "Your account isn't approved yet.") {
          setError({message: "Your account isn't approved yet. Please wait for approval email."});
        }
        else{
        setError({message: "The credentials you provided is incorrect. Please try again"});     
        }
      }
      
      else if (error?.message === "Request failed with status code 422"){
        setError({message: "Please enter valid credentials"});     
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <MvLoader />}
      <MvModal 
        isOpen={showRegistrationSuccess}
        onClose={() => setShowRegistrationSuccess(false)}
        title="Registration Successful"
        className="text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-100"
      >
        <div className="text-center p-4">
          Your account has been created successfully. Please log in.
        </div>
      </MvModal>
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-center w-full max-w-md gap-5 p-4 max-sm:w-11/12" >
          
        <img
          src={logo_dark}
          alt="logo"
          className="block w-3/4 mx-auto dark:hidden"
        />
        <img
          src={logo_light}
          alt="logo"
          className="hidden w-3/4 mx-auto dark:block"
        />
        <MvInput
          label="Email address"
          name="email"
          value={loginFormData.email}
          onChange={handleInputChange}
        />
        <div className="flex flex-col w-full gap-0">
          <MvPasswordInput
            label="Password"
            name="password"
            value={loginFormData.password}
            onChange={handleInputChange}
          />
          {/* <small className="self-end mr-4 dark:text-primary-50">
            Forget Password? <u>Click Here</u>
          </small> */}
        </div>
        <MvCheckbox
          id="rememberMe"
          label="Remember Me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        {/* Display error message */}
        {error && <p className="text-center text-red-500">{error.message}</p>}{" "}
        <div className="flex flex-col w-full gap-0">
          <MvButton className="w-1/2 mx-auto mt-4" disabled={loading}>
            {loading ? "Logging In..." : "Log In"} {/* Show loading state */}
          </MvButton>
        </div>
       <p className="self-center mr-4 dark:text-primary-50">
            Not a registered user?<Link to={MvRoutes.REGISTER} ><u> Register as guest</u></Link>
          </p>
      </form>
      <MvThemeToggle />
    </div>
    </>
  );
};

export default Login;
