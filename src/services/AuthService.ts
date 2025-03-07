// services/authService.ts

import { getData, postData } from "../app/MvApi";
import { MvUrl } from "../app/MvUrl";
import LoginPostData from "../app/Types/Auth/LoginPostData";
import { LoginResponse } from "../app/Types/Auth/loginResponse";

export const loginUser = async (loginPostData: LoginPostData):Promise<LoginResponse> =>  {
  // eslint-disable-next-line no-useless-catch
  try {
    console.log(MvUrl.LOGIN);
    const response = await postData<LoginResponse>(MvUrl.LOGIN, loginPostData);
    return response.data; // Return the response for further handling
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (id: number) => {
  return await getData(MvUrl.VERIFY_EMAIL(id));
};

export const sendVerification = async (email: string) => {
  return await postData(MvUrl.SEND_VERIFICATION(email), {});
};

export const confirmVerificationPage = async (id: number) => {
  return await getData(MvUrl.CONFIRM_VERIFICATION_PAGE(id));
};

export const confirmVerificationPost = async (id: number) => {
  return await postData(MvUrl.CONFIRM_VERIFICATION_POST(id), {});
};

export const getLoggedInUser = async () => {
  return await getData(MvUrl.GET_LOGGED_IN_USER);
};
