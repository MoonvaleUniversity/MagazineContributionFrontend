
import { deleteData, getData, postData, putData} from "../app/MvApi";
import { User } from "../app/MvObjects/user";
import { MvUrl } from "../app/MvUrl";
import { IUser } from "../app/Types/objects/user";

export const getAllStudents = async (  options?: { userId?: string; facultyId?: string; published?: boolean }): Promise<User[]> => {
  const params = new URLSearchParams({ noPagination: "1" });
   if (options?.facultyId) params.append("faculty_id", options.facultyId);
    const response = await getData(`${MvUrl.STUDENTS.INDEX}?${params}`);
    console.log(response);
    return response.data.students.map((userData: IUser) => User.fromJSON(userData));
  };

  export const createStudents = async (userData: Partial<User>) => {
    try {
      const response = await postData(MvUrl.POST_USER, userData);
      return response.data; 
    } catch (error) {
      console.error(error);
      return Response.error;
    }// Returning raw data without transformation
  };
  
  export const updateStudents = async (id: number, userData: Partial<User>) => {
    const response = await putData(MvUrl.STUDENTS.UPDATE(id), userData);
    return response.data; // Returning raw data without transformation
  };
  

export const deleteStudents = async (id: number): Promise<void> => {
  await deleteData(MvUrl.STUDENTS.DESTROY(id));
};