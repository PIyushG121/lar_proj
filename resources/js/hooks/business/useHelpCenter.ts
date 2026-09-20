import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

const fetchHelpContent = async () => {
    const { data } = await api.get("/help");
    return data;
};

const searchHelp = async (query: string) => {
    if (!query) return null;
    const { data } = await api.get("/help/search", { params: { q: query } });
    return data;
};

export function useHelpCenter() {
    return useQuery({
        queryKey: ["help-content"],
        queryFn: fetchHelpContent,
    });
}

export function useHelpSearch(query: string) {
    return useQuery({
        queryKey: ["help-search", query],
        queryFn: () => searchHelp(query),
        enabled: query.length > 2,
    });
}
