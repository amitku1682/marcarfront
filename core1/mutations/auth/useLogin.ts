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
      rejectUnauthorized: false,
    }),
  });
      return response.data;
    },
    onSuccess: (data) => {
      // Handle success, e.g., save token, navigate, etc.
    //   console.log(data.payload.userData.token);

     
      const token= data.payload.userData.token
      const id= data.payload.userData.id
      const user= data.payload.userData.username
      //console.log(token+"token")
    //   console.log(sessionStorage.setItem('authToken', 't'));
      sessionStorage.setItem("authToken", token);

      sessionStorage.setItem('userId','1');
      sessionStorage.setItem('user',user);
      //console.log(token)
      	 
		
          
      navigate.push('/');
           
    },
    onError: (error: RequestError) => {
      // Handle error
      showErrorMessage({ error });
    },
  });
};

export default useLogin;
