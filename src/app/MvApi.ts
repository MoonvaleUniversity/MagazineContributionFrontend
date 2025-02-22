import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type" : "application/json",
    }
})
export const getData = async(url:string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("GET request failed:",error);
        throw error;
    }
}
export const postData = async(url:string, data:object) => {
    try {
        const response = await axios.post(url, data);
        console.log(url);
        return response.data;
    } catch (error) {
        console.error("POST request failed:",error);
        throw error;
    }
}