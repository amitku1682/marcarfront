import { useMutation } from "@tanstack/react-query"
import api, { RequestError, showErrorMessage } from "../../api";

const useUpdateAvatar = () => {
    const mutation = useMutation({
        mutationFn: async (data: any) => {
            // convert data as a FormData payload
            const formdata = new FormData();
            formdata.append("avatar", "some file object as value");
            const response = await api.post(ENDPOINTS.UPDATE_AVATAR, formdata, { headers: { "Content-Type": "multipart/formdata" } });
            return response.data;
        },
        onSuccess: data => {
            // do something when avatar is successfuly uploaded...
            console.log(data);
        },
        onError: (error: RequestError) => {
            // do something if the request fails for a reason
            showErrorMessage({ error })
        }
    });

    return mutation;
}
export default useUpdateAvatar;