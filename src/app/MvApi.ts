import axios, { AxiosInstance } from "axios";
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
export const postData = async (url: string, data: object) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.post(url, data);
        return response;
    } catch (error) {
        throw error;
    }
}

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
