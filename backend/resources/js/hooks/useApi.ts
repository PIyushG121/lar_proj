import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useMetrics = () => {
    return useQuery({
        queryKey: ["metrics"],
        queryFn: async () => {
            const { data } = await api.get("/metrics");
            return data;
        },
    });
};

export const useTransactions = (params: { page?: number; search?: string; filter?: string } = {}) => {
    return useQuery({
        queryKey: ["transactions", params],
        queryFn: async () => {
            const { data } = await api.get("/transactions", { params });
            return data;
        },
    });
};

export const useFetchMonthlyBreakdown = () => {
    return useQuery({
        queryKey: ["metrics", "breakdown"],
        queryFn: async () => {
            const { data } = await api.get("/metrics/breakdown");
            return data;
        },
    });
};
