import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });
        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }

        try {
            const res = await axios.post("/auth/signup", {
                name,
                email,
                password,
            });
            set({ user: res.data.user, loading: false });
            toast.success("Account created successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(
                error.response?.data?.message || "Something went wrong",
            );
        }
    },

    login: async ({ email, password }) => {
        set({ loading: true });

        try {
            const res = await axios.post("/auth/login", {
                email,
                password,
            });
            set({ user: res.data.user, loading: false });
            toast.success("Logged in successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(
                error.response?.data?.message || "Something went wrong",
            );
        }
    },

    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ user: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong",
            );
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const res = await axios.get("/auth/profile");
            set({ user: res.data, checkingAuth: false });
        } catch (error) {
            set({ checkingAuth: false, user: null });
            console.log("Error in getting user profile:", error);
        }
    },

    refreshToken: async () => {
        if (get().checkingAuth) return;
        set({ checkingAuth: true });

        try {
            const res = await axios.post("/auth/refresh-token");
            set({ user: res.data.user });
            return res.data.user;
        } catch (error) {
            toast.error("Session expired. Please log in again.");
            return Promise.reject(error);
        } finally {
            set({ checkingAuth: false });
        }
    },
}));

export default useUserStore;

// ToDo: implemet the axios interceptors for refreshing the token every 15m

// axios interceptor for token refresh

let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }

                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;
                return axios(originalRequest);
            } catch (refreshError) {
                refreshPromise = null;
                useUserStore.getState().logout();
                toast.error("Session expired. Please log in again.");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);
