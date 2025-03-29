
import { deleteData, getData, postData, putData} from "../app/MvApi";
import { User } from "../app/MvObjects/user";
import { MvUrl } from "../app/MvUrl";
import { IUser } from "../app/Types/objects/user";

export const getAllAdmin = async (): Promise<User[]> => {
    const response = await getData(MvUrl.ADMINS.INDEX);
    console.log(response);
    return response.data.users.data.map((userData: IUser) => User.fromJSON(userData));
  };

  export const createAdmin = async (userData: Partial<User>) => {
    try {
      const response = await postData(MvUrl.ADMINS.STORE, userData);
      return response.data; 
    } catch (error) {
      console.error(error);
    }// Returning raw data without transformation
  };
  
  export const updateAdmin = async (id: number, userData: Partial<User>) => {
    const response = await putData(MvUrl.ADMINS.UPDATE(id), userData);
    return response.data; // Returning raw data without transformation
  };
  

export const deleteAdmin = async (id: number): Promise<void> => {
  await deleteData(MvUrl.ADMINS.DESTROY(id));
};