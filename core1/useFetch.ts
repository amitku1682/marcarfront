import { useQuery } from "@tanstack/react-query";
import api from "./api";

// in case of dynamic fetch you need to send all the three parameters; last one as true.
const useFetch = (endpoint: string, id?: string, validate: boolean = false) => {
    const result = useQuery({
        queryKey: [endpoint, ...(id ? [id] : [])],
        queryFn: async () => {
            const res = id ? await api.get(endpoint + "/" + id) : await api.get(endpoint);
            return res.data;
        },
        enabled: validate ? Boolean(id) : true,
    });
    return result;
};

export default useFetch;
