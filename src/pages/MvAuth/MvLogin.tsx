import React, { ChangeEvent, useState } from "react";
import { MvInput, MvPasswordInput } from "../../components/MvInput";
import { MvButton } from "../../components/MvButton";
import { MvThemeToggle } from "../../components/MvThemeToggle";
import { loginUser } from "../../services/AuthService";
import LoginPostData from "../../app/Types/Auth/LoginPostData";
import { ApiError } from "../../app/MvApi";
import { useNavigate } from "react-router-dom";
import MvRoutes from "../../app/MvRoutes";



const Login: React.FC = () => {
  const [error, setError] = useState<ApiError>();
  const [loading, setLoading] = useState(false);
  const [loginFormData, setLoginFormData] = useState<LoginPostData>({
    email: "",
    password: "",
  })
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value
    }))
  }

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
      const response = await loginUser(loginFormData);
      console.log(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error);
      if (error.message == 'You need to verify your email first.') {
        navigate(MvRoutes.EMAIL_VERIFY, { state: { email: loginFormData.email } })
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin} // Use onSubmit to handle form submission
        className="flex flex-col justify-center w-full max-w-md gap-5 p-4 max-sm:w-11/12"
      >
        <img
          src="/src/assets/images/logo dark.png"
          alt="logo"
          className="block w-3/4 mx-auto dark:hidden"
        />
        <img
          src="/src/assets/images/logo light.png"
          alt="logo"
          className="hidden w-3/4 mx-auto dark:block"
        />

        <MvInput
          label="Email address"
          name="email"
          value={loginFormData.email}
          onChange={handleInputChange} // Update email state
        />
        <div className="flex flex-col w-full gap-0">
          <MvPasswordInput
            label="Password"
            name="password"
            value={loginFormData.password}
            onChange={handleInputChange} // Update password state
          />
          <small className="self-end mr-4 dark:text-primary-50">
            Forget Password? <u>Click Here</u>
          </small>
        </div>
        {error && <p className="text-center text-red-500">{error.message}</p>} {/* Display error message */}
        <div className="flex flex-col w-full gap-0">
          <MvButton className="w-1/2 mx-auto mt-4" disabled={loading}>
            {loading ? "Logging In..." : "Log In"} {/* Show loading state */}
          </MvButton>
          <p className="text-center dark:text-primary-50">Remember Me</p>
        </div>
      </form>
      <MvThemeToggle />
    </div>
  );
};

export default Login;