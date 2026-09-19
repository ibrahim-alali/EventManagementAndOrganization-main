import axios from "axios";
import { ENV } from "../config/env";
import { getToken } from "../utils/authToken";

declare module "axios" {
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}

const axiosClient = axios.create({
    baseURL: ENV.API_BASE_URL,
    headers: {
        "Content-Type": "application/json", // Default for all api request
    },
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
    if (!config.skipAuth) { // if skipAuth is not provided (skipAuth = false)
        const token = getToken();
        if (token) {
            (config.headers as any) = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
    }
    return config;
});

export default axiosClient;