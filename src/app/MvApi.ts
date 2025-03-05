import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UNSAFE_createBrowserHistory } from "react-router-dom";

const history = UNSAFE_createBrowserHistory();
console.log(history);

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
})

api.interceptors.request.use((config) => {
    const AccessToken = localStorage.getItem("Access Token");
    if (AccessToken) {
        config.headers.Authorization = `Bearer ${AccessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (!error.response) throw error; // Handle cases where there's no response (e.g., network error)

        const { status, data } = error.response as { status: number; data: ApiError };

        if (status === 401) {
            localStorage.removeItem('Access_Token');
        }

        if (status === 404) {
            // Handle 404 error
        }

        throw data; // Throw the structured error response
    }
);

export const getData = async (url: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.get(url);
        return response;
    } catch (error) {
        throw error;
    }
} 
export const postData = async <T>(url: string, data: object): Promise<AxiosResponse<T>> => {
   
    
    const response = await axios.post(url, data); // Use api instead of axios
    return response;
};
export const putData = async <T>(url: string, data: object): Promise<AxiosResponse<T>> => {
    
    
    
        const response = await api.put(url, data); // Use the api instance for PUT requests
        return response;

};
export const deleteData = async <T>(url: string): Promise<AxiosResponse<T>> => {
  
        const response = await api.delete(url);  // Use the api instance for DELETE requests
        return response;
 
};


export interface ApiError {
    message?: string;
    success?: boolean;
    data?: null;
    errors?: Record<string, string[]>;
    meta?: {
        timestamp: string;
        status: number;
    };
}
export const uploadMultimedia = async <T>(url: string, data: object): Promise<AxiosResponse<T>> => {
  

   
    // Retrieve the token from localStorage or sessionStorage
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    console.log('Bearer Token:', token);
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error response:', error.response);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error; // Re-throw the error if you want to handle it later
    }

 
};
