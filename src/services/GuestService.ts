
import { deleteData, getData, postData, putData} from "../app/MvApi";
import { User } from "../app/MvObjects/user";
import { MvUrl } from "../app/MvUrl";
import { IUser } from "../app/Types/objects/user";

export const getAllGuest = async ( options?: {  facultyId?: string; }): Promise<User[]> => {

  const queryParams = new URLSearchParams();
  if (options?.facultyId) queryParams.append("faculty_id", options.facultyId);
  queryParams.append("noPagination", "1");
    const response = await getData(`${MvUrl.GUESTS.INDEX}?${queryParams.toString()}`);
    console.log(response);
    return response.data.guests.map((userData: IUser) => User.fromJSON(userData));
  };

  export const createGuest = async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    faculty_id: number;
  }) => {
    try {
      const response = await postData(MvUrl.GUESTS.STORE, userData);
      return response.data; 
    } catch (error) {
      console.error(error);
    }// Returning raw data without transformation
  };
  
  export const updateGuest = async (id: number, userData: Partial<User>) => {
    const response = await putData(MvUrl.GUESTS.UPDATE(id), userData);
    return response.data; // Returning raw data without transformation
  };
  

export const deleteGuest = async (id: number): Promise<void> => {
  await deleteData(MvUrl.GUESTS.DESTROY(id));
};

export const approveGuest = async (id: number): Promise<void> => {
  await postData(MvUrl.GUESTS.APPROVE(id), {});
};


