import axiosClient from "./axiosClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface MeResponse {
  full_name: string;
  role: string;
  email: string;
  phone: string;
  profile_picture: string;
}

export const authApi = {
  login: async (data: LoginPayload) => {
    const res = await axiosClient.post("/auth/login", data, {
      skipAuth: true,
    });
    return res.data;
  },

  signup: async (data: SignupPayload) => {
    const res = await axiosClient.post("/auth/register", data, {
      skipAuth: true,
    });
    return res.data;
  },

  me: async (): Promise<MeResponse> => {
    const res = await axiosClient.get("/auth/me");
    return res.data;
  },
};