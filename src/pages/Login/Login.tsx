import React from "react";
import { MvInput, MvPasswordInput } from "../../components/MvInput";
import { MvButton } from "../../components/MvButton";
import { MvThemeToggle } from "../../components/MvThemeToggle";

export const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        action=""
        method="post"
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

        <MvInput label="Email address" />
        <div className="flex flex-col w-full gap-0">
          <MvPasswordInput label="Password" />
          <small className="self-end mr-4 dark:text-primary-50">
            Forget Password? <u>Click Here</u>
          </small>
        </div>
        <div className="flex flex-col w-full gap-0">
          <MvButton className="w-1/2 mx-auto mt-4 ">Log In</MvButton>
          <p className="text-center dark:text-primary-50">Remember Me</p>
        </div>
      </form>
      <MvThemeToggle />
    </div>
  );
};
