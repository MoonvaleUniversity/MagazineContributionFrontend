// services/authService.ts

import { NavigateFunction } from "react-router-dom";
import { getData, postLogin } from "../app/MvApi";
import MvRoutes from "../app/MvRoutes";
import { MvUrl } from "../app/MvUrl";
import LoginPostData from "../app/Types/Auth/LoginPostData";
import { LoginResponse } from "../app/Types/Auth/loginResponse";
import { IUser } from "../app/Types/objects/user";

export const loginUser = async (loginPostData: LoginPostData):Promise<LoginResponse> =>  {
  // eslint-disable-next-line no-useless-catch
  try {
    console.log(MvUrl.LOGIN);
    const response = await postLogin<LoginResponse>(MvUrl.LOGIN, loginPostData);
    return response.data; // Return the response for further handling
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (id: number) => {
  return await getData(MvUrl.VERIFY_EMAIL(id));
};

export const sendVerification = async (email: string) => {
  return await postLogin(MvUrl.SEND_VERIFICATION(email), {});
};

export const confirmVerificationPage = async (id: number) => {
  return await getData(MvUrl.CONFIRM_VERIFICATION_PAGE(id));
};

export const confirmVerificationPost = async (id: number) => {
  return await postLogin(MvUrl.CONFIRM_VERIFICATION_POST(id), {});
};

export const getLoggedInUser = async () => {
  return await getData(MvUrl.GET_LOGGED_IN_USER);
};

export const getAuthToken = (): string | null => {
  // Try localStorage first, then sessionStorage
  return (
    localStorage.getItem('userToken') ||
    sessionStorage.getItem('userToken') ||
    null
  );
};

export const getUserData = (): IUser | null => {
  try {
    // Try to get from localStorage first
    const localStorageData = localStorage.getItem('userData');
    if (localStorageData) {
      return JSON.parse(localStorageData);
    }

    // If not in localStorage, try sessionStorage
    const sessionStorageData = sessionStorage.getItem('userData');
    if (sessionStorageData) {
      return JSON.parse(sessionStorageData);
    }

    return null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const checkAuthAndRedirect = (navigate: NavigateFunction) => {
  const token = getAuthToken();
  const userData = getUserData();

  if (!token || !userData) {
    navigate(MvRoutes.LOGIN);
    return;
  }

  switch(userData.role) {
    case 'Admin':
      navigate(MvRoutes.ADMIN.FACULTY);
      break;
    case 'Student':
      navigate(MvRoutes.STUDENTS.DASHBOARD);
      break;
    case 'Marketing Manager':
      navigate(MvRoutes.MARKET_MANAGER.FACULTY);
      break;
    case 'Marketing Coordinator':
      navigate(MvRoutes.MARKET_COORDINATOR.STUDENTS);
      break;
    default:
      navigate(MvRoutes.GUEST.DASHBOARD);
  }
};  