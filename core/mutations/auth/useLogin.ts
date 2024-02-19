import { useMutation } from "@tanstack/react-query";
import api, { RequestError, showErrorMessage } from "../../api";
import { LoginForm } from "../../form.interfaces";
import ENDPOINTS from "@/core/endpoints";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from 'react-router-dom';
import { constants } from "buffer";
import { useRouter } from "next/router";
import https from 'https';




const useLogin = () => {
  const navigate = useRouter();

  return useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await api.post(ENDPOINTS.LOGIN, data, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,  // Ignore SSL certificate validation (not recommended for production)
        }),
      });
      return response.data;
    },
    onSuccess: (data) => {
      const token = data.payload.userData.token;
      const user = data.payload.userData.username;

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem('user', user);

      navigate.push('/hr/Dashboard');
    },
    onError: (error: RequestError) => {
      showErrorMessage({ error });
    },
  });
};

export default useLogin;
