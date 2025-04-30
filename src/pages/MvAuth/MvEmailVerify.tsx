import React, { useState } from "react";
import { MvButton } from "../../components/MvButton";
import { MvThemeToggle } from "../../components/MvThemeToggle";
import { useLocation, useNavigate } from "react-router-dom";
import { sendVerification } from "../../services/AuthService";
import { MvLoader } from "../../components/MvLoader";
import { logo_dark, logo_light } from "../../app/MvConstants";

const MvEmailVerify: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  if (!location.state.email) {
    navigate(-1); // Go back to the previous page
    return null;
  }

  const handleVerifyEmail = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await sendVerification(location.state.email);
      console.log(response);
      setMessage("Verification email sent! Check your inbox.");
      document.cookie = "newuser=true; max-age=86400"; // 24 hours
    } catch (err) {
      console.error(err);
      setError("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return ( <>
   {loading && <MvLoader />}
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center w-full max-w-md gap-5 p-4 max-sm:w-11/12">

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

        {/* Title */}
        <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>

        {/* Instruction Text */}
        <p className="text-center dark:text-white">
          You need to verify your email first. Please click the button below to verify your email address.
        </p>

       
        {message && <p className="text-center text-green-500">{message}</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Verify Button */}
        <MvButton className="w-1/2 mx-auto mt-4" onClick={handleVerifyEmail} disabled={loading}>
          {loading ? "Sending..." : "Verify Email"}
        </MvButton>

        {/* Theme Toggle */}
        <MvThemeToggle />
      </div>
    </div></>
  );
};

export default MvEmailVerify;