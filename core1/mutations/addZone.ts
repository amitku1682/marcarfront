import { useMutation } from "@tanstack/react-query";
import api, { RequestError, showErrorMessage } from "../api";
import { ZoneForm  } from "../form.interfaces";
import ENDPOINTS from "@/core/endpoints";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from 'react-router-dom';
import { constants } from "buffer";
import { useRouter } from "next/router";
const useZone = () => {
 const navigate = useRouter();

  return useMutation({
    mutationFn: async (data: ZoneForm) => {
      const response = await api.post(ENDPOINTS.ZONE, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Handle success, e.g., save token, navigate, etc.
    //   console.log(data.payload.userData.token);

     
    console.log(data)
           
    },
    onError: (error: RequestError) => {
      // Handle error
      showErrorMessage({ error });
    },
  });
};

export default useZone;
