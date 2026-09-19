import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getToken } from "../../utils/authToken";

export const QueryCacheManager = () => {
    const queryClient = useQueryClient();
    const token = getToken();

    useEffect(() => {
        queryClient.clear();
    }, [token, queryClient]);

    return null;
};