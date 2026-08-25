import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
    products: [],
    loading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products", productData);
            set((prevState) => ({
                products: [...prevState.products, res.data],
            }));
            toast.success("Product created successfully");
            return true;
        } catch (error) {
            console.log("Error from createProduct: ", error);
            toast.error(
                error.response.data.error || "Failed to create product",
            );
        } finally {
            set({ loading: false });
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true });
        try {
            await axios.delete(`/products/${id}`);
            set((prevState) => ({
                products: prevState.products.filter(
                    (product) => product._id !== id,
                ),
            }));
            toast.success("Product deleted successfully");
            return true;
        } catch (error) {
            console.log("Error from deleteProduct: ", error);
            toast.error(
                error.response.data.error || "Failed to delete product",
            );
        } finally {
            set({ loading: false });
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/products");
            set({ products: res.data });
            return true;
        } catch (error) {
            console.log("Error from fetchAllProducts: ", error);
            toast.error(
                error.response.data.error || "Failed to fetch products",
            );
        } finally {
            set({ loading: false });
        }
    },

    toggleFeaturedProduct: async (id) => {
        set({ loading: true });
        try {
            await axios.patch(`/products/${id}`);
            set((prevState) => ({
                products: prevState.products.map((product) =>
                    product._id === id
                        ? { ...product, isFeatured: !product.isFeatured }
                        : product,
                ),
            }));
            toast.success("Product featured status toggled successfully");
            return true;
        } catch (error) {
            console.log("Error from toggleFeatured: ", error);
            toast.error(
                error.response.data.error ||
                    "Failed to toggle product featured status",
            );
        } finally {
            set({ loading: false });
        }
    },

    fetchCategoryProducts: async (category) => {
        set({ loading: true });
        try {
            const res = await axios.get(`/products/category/${category}`);
            set({ products: res.data.products });
            return true;
        } catch (error) {
            console.log("Error from fetchCategoryProducts: ", error);
            toast.error(
                error.response.data.error || "Failed to fetch products",
            );
        } finally {
            set({ loading: false });
        }
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/products/featured");
            set({ products: res.data });
        } catch (error) {
            console.log("Error from fetchFeaturedProducts: ", error);
            toast.error("Failed to fetch featured products");
        } finally {
            set({ loading: false });
        }
    },
}));
