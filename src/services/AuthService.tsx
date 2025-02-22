// services/authService.ts

import { getData, postData } from "../app/MvApi";
import { LoginParamHolder } from "../app/MvObjects/holder/MvLoginParamHolder";
import { MvUrl } from "../app/MvUrl";

export const loginUser  = async (email: string, password: string, role: string) => {
  const loginParams = new LoginParamHolder(email, password, role);
  console.log(MvUrl.LOGIN);
  try {
    const response = await postData(MvUrl.LOGIN, loginParams.toMap());
    return response; // Return the response for further handling
  } catch (error) {
    console.error("Login failed. Please check your credentials.",error); // Throw an error to be caught in the component
    throw error;
}
};

export const verifyEmail = async (id: number) => {
    return await getData(MvUrl.VERIFY_EMAIL(id));
  };
  
  export const sendVerification = async (id: number) => {
    return await postData(MvUrl.SEND_VERIFICATION(id), {});
  };
  
  export const confirmVerificationPage = async (id: number) => {
    return await getData(MvUrl.CONFIRM_VERIFICATION_PAGE(id));
  };
  
  export const confirmVerificationPost = async (id: number) => {
    return await postData(MvUrl.CONFIRM_VERIFICATION_POST(id), {});
  };
  
  export const getLoggedInUser  = async () => {
    return await getData(MvUrl.GET_LOGGED_IN_USER);
  };
