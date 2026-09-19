import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginPayload, type SignupPayload } from "../api/auth";
import { getToken, setToken, removeToken } from "../utils/authToken";
import { setRole, removeRole } from "../utils/authRole";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (data) => {
      if (data.access) {
        setToken(data.access);
        queryClient.invalidateQueries({ queryKey: ["me", token] });
      }
      if (data.role) setRole(data.role);
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (data: SignupPayload) => authApi.signup(data),
    onSuccess: (data) => {
      if (data.access) {
        setToken(data.access);
        queryClient.invalidateQueries({ queryKey: ["me", token] });
      }
      if (data.role) setRole(data.role);
    },
  });
};

export const useMe = () => {
  const token = getToken();
  return useQuery({
    queryKey: ["me", token],
    queryFn: authApi.me,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    removeToken();
    removeRole();

    queryClient.clear();
    sessionStorage.removeItem("venue-hover-hint");
  };

  return { logout };
};
