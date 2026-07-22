import axios from "axios";
import { setupInterceptors } from "./interceptors";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({ baseURL: API_URL });
export const authApi = axios.create({ baseURL: API_URL, withCredentials: true });

setupInterceptors(api, authApi);
