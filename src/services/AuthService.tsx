// services/authService.ts

import { getData, postData } from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";
import LoginPostData from "../app/Types/Auth/loginPostData";

export const loginUser  = async (loginPostData: LoginPostData) => {
  try {
    const response = await postData(MvUrl.LOGIN, loginPostData);
    return response; // Return the response for further handling
  } catch (error) {
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
