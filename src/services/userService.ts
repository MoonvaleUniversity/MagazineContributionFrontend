// services/UserService.ts

import { deleteData, getData, postData, putData} from "../app/MvApi";
import { User } from "../app/MvObjects/user";
import { MvUrl } from "../app/MvUrl";
import { IUser } from "../app/Types/objects/user";

export const getAllUsers = async (): Promise<User[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append("noPagination", "1");
    const response = await getData(`${MvUrl.GET_USERS}?${queryParams.toString()}`);
    console.log(response);
    return response.data.users.map((userData: IUser) => User.fromJSON(userData));
  };

  export const createUser = async (userData: Partial<User>) => {
    
      console.log(userData);
      const response = await postData(MvUrl.POST_USER, userData);
      console.log(response);
      return response; 
    // Returning raw data without transformation
  };
  
  export const updateUser = async (id: number, userData: Partial<User>) => {
    const response = await putData(MvUrl.UPDATE_USER(id), userData);
    return response.data; // Returning raw data without transformation
  };
  

export const deleteUser = async (id: number): Promise<void> => {
  await deleteData(MvUrl.DELETE_USER(id));
};
export const getUser = async (id: number): Promise<IUser> => {
  const response = await getData(MvUrl.SHOW_USER(id));
  return response.data.user as IUser;
};