import React, { ChangeEvent, useState } from "react";
import { MvCheckbox, MvInput, MvPasswordInput } from "../../components/MvInput";
import { MvButton } from "../../components/MvButton";
import { MvThemeToggle } from "../../components/MvThemeToggle";
import { loginUser } from "../../services/AuthService";
import LoginPostData from "../../app/Types/Auth/LoginPostData";
import { ApiError } from "../../app/MvApi";
import { useNavigate } from "react-router-dom";
import MvRoutes from "../../app/MvRoutes";
import { LoginResponse } from "../../app/Types/Auth/loginResponse";
import { MvLoader } from "../../components/MvLoader";
import { logo_dark, logo_light } from "../../app/MvConstants";

const Login: React.FC = () => {
  const [error, setError] = useState<ApiError>();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginFormData, setLoginFormData] = useState<LoginPostData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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
      console.log(response);

      // Check if the response message is "Login success."
      if (response.message === "Login success.") {
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

        const userRole = response.data.user.role;  // Assuming role is in response data
        if (userRole === "Admin") {
          navigate(MvRoutes.ADMIN.FACULTY); // Example route for Admin
        } else if (userRole === "Student") {
          navigate(MvRoutes.STUDENTS.DASHBOARD); // Example route for Student
        } else {
          navigate(MvRoutes.DASHBOARD); // Default route
        }
      } 

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError({ message: error?.message || "An unknown error occurred." });

      if (error?.message === "You need to verify your email first.") {
        navigate(MvRoutes.EMAIL_VERIFY, {
          state: { email: loginFormData.email },
        });
      }
      else if (error?.message === "Request failed with status code 500") {
        setError({message: "Please check your email and try again"});
      }
      else if (error?.message === "Request failed with status code 401"){
        setError({message: "Wrong Password. Please try again"});     
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
        {error && <p className="text-center text-red-500">{error.message}</p>}{" "}
        {/* Display error message */}
        <div className="flex flex-col w-full gap-0">
          <MvButton className="w-1/2 mx-auto mt-4" disabled={loading}>
            {loading ? "Logging In..." : "Log In"} {/* Show loading state */}
          </MvButton>
        </div>
      </form>
      <MvThemeToggle />
    </div>
    </>
  );
};

export default Login;
