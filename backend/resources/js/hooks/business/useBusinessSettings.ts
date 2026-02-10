"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetchSettings = async () => {
    const res = await fetch(`${API_URL}/settings`, {
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        },
    });
    if (!res.ok) {
        const errorText = await res.text();
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || `Failed to fetch settings: ${res.status}`);
        } catch (e: any) {
            if (e.message && e.message !== "Unexpected end of JSON input") throw e;
            throw new Error(`Failed to fetch settings: ${res.status} ${errorText}`);
        }
    }
    return res.json();
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
            const res = await fetch(`${API_URL}/settings/account`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update account");
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business-settings"] }),
    });

    const updateCompany = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`${API_URL}/settings/company`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update company");
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business-settings"] }),
    });

    const updatePreferences = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`${API_URL}/settings/preferences`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update preferences");
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business-settings"] }),
    });

    const updatePassword = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`${API_URL}/settings/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to update password");
            }
            return res.json();
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
