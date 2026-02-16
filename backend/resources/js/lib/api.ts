import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
});

// Interceptor to add Organization ID from meta tag or global state if needed
// For now, we'll try to get it from the page props if we were in a component, 
// but here we can try to look at the window object or assume the user has one org.
api.interceptors.request.use((config) => {
    // In many Inertia setups, we can access shared props via window.Laravel.initialPage.props
    const pageProps = (window as any)._inertia_props || {};
    const orgId = pageProps.auth?.user?.current_organization_id;

    if (orgId) {
        config.headers["X-Organization-ID"] = orgId;
    }

    return config;
});

export default api;
