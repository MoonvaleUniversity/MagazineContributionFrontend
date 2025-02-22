import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type" : "application/json",
    }
})

api.interceptors.request.use((config) => {
    const AccessToken = localStorage.getItem("Access Token");
    if (AccessToken) {
      config.headers.Authorization = `Bearer ${AccessToken}`;
    }
    return config;
});

api.interceptors.response.use(response => {
    return response.data
}, (error) => {
    const { status } = error.response
    if (status === 401) {
        localStorage.removeItem('Access_Token');
    }
    if (status === 404) {

    }
    throw error.response.data
})

export const getData = async(url:string) => {
    try {
        const response = await api.get(url);
        return response;
    } catch (error) {
        throw error;
    }
}
export const postData = async(url:string, data:object) => {
    try {
        const response = await api.post(url, data);
        return response;
    } catch (error) {
        throw error;
    }
}