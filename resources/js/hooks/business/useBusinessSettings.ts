"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

const fetchSettings = async () => {
    const { data } = await api.get("/settings");
    return data;
};

export function useBusinessSettings() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["business-settings"],
        queryFn: async () => {
            return fetchSettings();
        },
    });

    const updateAccount = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/settings/account", data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business-settings"] }),
    });

    const updateCompany = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/settings/company", data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business-settings"] }),
    });

    const updatePreferences = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/settings/preferences", data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business-settings"] }),
    });

    const updatePassword = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/settings/password", data);
            return response.data;
        }
    });

    return {
        settings: query.data,
        isLoading: query.isLoading,
        error: query.error,
        updateAccount,
        updateCompany,
        updatePreferences,
        updatePassword
    };
}
