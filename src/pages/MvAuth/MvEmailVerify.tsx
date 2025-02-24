import React from "react";
import { MvButton } from "../../components/MvButton";
import { MvThemeToggle } from "../../components/MvThemeToggle";
import { useLocation, useNavigate } from "react-router-dom";
import { sendVerification } from "../../services/AuthService";

const MvEmailVerify: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state.email) {
    navigate(-1); // Go back to the previous page
    return null;
  }

  const handleVerifyEmail = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await sendVerification(location.state.email);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center w-full max-w-md gap-5 p-4 max-sm:w-11/12">

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

        {/* Title */}
        <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>

        {/* Instruction Text */}
        <p className="text-center dark:text-white">
          You need to verify your email first. Please click the button below to verify your email address.
        </p>

        {/* Message Area */}
        {/* <p className="text-center text-green-500">
          Email verified successfully! 🎉
        </p> */}

        {/* Verify Button */}
        <MvButton className="w-1/2 mx-auto mt-4" onClick={handleVerifyEmail}>
          Verify Email
        </MvButton>

        {/* Theme Toggle */}
        <MvThemeToggle />
      </div>
    </div>
  );
};

export default MvEmailVerify;