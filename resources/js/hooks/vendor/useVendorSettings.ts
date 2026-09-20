import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

const fetchSettings = async () => {
    const { data } = await api.get("/vendor/settings");
    return data;
};

export function useVendorSettings() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["vendor-settings"],
        queryFn: fetchSettings,
    });

    const updateAccount = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/vendor/settings/account", data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendor-settings"] }),
    });

    const updateCompany = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/vendor/settings/company", data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendor-settings"] }),
    });

    const updatePreferences = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/vendor/settings/preferences", data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendor-settings"] }),
    });

    const updatePassword = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/vendor/settings/password", data);
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
