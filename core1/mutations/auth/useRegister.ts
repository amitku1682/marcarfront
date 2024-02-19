import { useMutation } from "@tanstack/react-query"
import api, { RequestError, showErrorMessage } from "../../api";
import { RegisterForm } from "../../form.interfaces";
import ENDPOINTS from "@/core/endpoints";

const useRegister = () => {
    const mutation = useMutation({
        mutationFn: async (data: RegisterForm) => {
            const response = await api.post(ENDPOINTS.REGISTER, data);
            return response.data;
        },
        onSuccess: data => {
            // do something when registration is successful...
            console.log(data);
        },
        onError: (error: RequestError) => {
            // do something if the request fails for a reason
            showErrorMessage({ error })
        }
    });

    return mutation;
}
export default useRegister;