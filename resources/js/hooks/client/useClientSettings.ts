import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

const fetchSettings = async () => {
    const { data } = await api.get("/client/settings");
    return data;
};

export function useClientSettings() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["client-settings"],
        queryFn: fetchSettings,
    });

    const updateAccount = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/client/settings/account", data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["client-settings"] }),
    });

    const updateCompany = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/client/settings/company", data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["client-settings"] }),
    });

    const updatePreferences = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/client/settings/preferences", data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["client-settings"] }),
    });

    const updatePassword = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/client/settings/password", data);
            return response.data;
        },
    });

    return {
        settings: query.data,
        isLoading: query.isLoading,
        error: query.error,
        updateAccount,
        updateCompany,
        updatePreferences,
        updatePassword,
    };
}
