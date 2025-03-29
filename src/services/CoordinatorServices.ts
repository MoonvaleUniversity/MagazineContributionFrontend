
import { deleteData, getData, postData, putData} from "../app/MvApi";
import { User } from "../app/MvObjects/user";
import { MvUrl } from "../app/MvUrl";
import { IUser } from "../app/Types/objects/user";

export const getAllCoordinators = async (): Promise<User[]> => {
    const response = await getData(MvUrl.COORDINATORS.INDEX);
    console.log(response);
    return response.data.coordinators.map((userData: IUser) => User.fromJSON(userData));
  };

  export const createCoordinators = async (userData: Partial<User>) => {
    try {
      const response = await postData(MvUrl.COORDINATORS.STORE, userData);
      return response.data; 
    } catch (error) {
      console.error(error);
    }// Returning raw data without transformation
  };
  
  export const updateCoordinators = async (id: number, userData: Partial<User>) => {
    const response = await putData(MvUrl.COORDINATORS.UPDATE(id), userData);
    return response.data; // Returning raw data without transformation
  };
  

export const deleteCoordinators = async (id: number): Promise<void> => {
  await deleteData(MvUrl.COORDINATORS.DESTROY(id));
};