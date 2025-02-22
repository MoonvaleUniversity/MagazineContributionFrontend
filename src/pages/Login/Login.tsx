import React, { useState } from "react";
import { MvInput, MvPasswordInput } from "../../components/MvInput";
import { MvButton } from "../../components/MvButton";
import { MvThemeToggle } from "../../components/MvThemeToggle";
import { loginUser } from "../../services/AuthService";



const Login: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error message

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(email, password, "student"); // Call the service function
      console.log("Login successful:", response);
      // Handle successful login (e.g., redirect, store token, etc.)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      setError(error.message); // Set the error message from the service
      console.error("Login error:", error);
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
          value={email} 
          onChange={(e) => setEmail(e.target.value)} // Update email state
        />
        <div className="flex flex-col w-full gap-0">
          <MvPasswordInput 
            label="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} // Update password state
          />
          <small className="self-end mr-4 dark:text-primary-50">
            Forget Password? <u>Click Here</u>
          </small>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>} {/* Display error message */}
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