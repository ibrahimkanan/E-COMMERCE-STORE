import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data });
            get().calcuteTotal();
        } catch (error) {
            set({ cart: [], total: 0, coupon: null, subtotal: 0 });
            console.log("Error from getCartItems: ", error);
            toast.error(
                error.response.data.error || "Failed to get cart items",
            );
        }
    },

    addToCart: async (product) => {
        try {
            const res = await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart");

            set((prevState) => {
                const existingItem = prevState.cart.find(
                    (item) => item._id === product._id,
                );
                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                          item._id === product._id
                              ? { ...item, quantity: item.quantity + 1 }
                              : item,
                      )
                    : [...prevState.cart, { ...product, quantity: 1 }];

                return {
                    cart: newCart,
                    total: res.data.total,
                };
            });

            get().calcuteTotal();
        } catch (error) {
            console.log("Error from addToCart: ", error);
            toast.error(
                error.response.data.error || "Failed to add product to cart",
            );
        }
    },

    calcuteTotal: () => {
        const { cart } = get();
        const subtotal = cart.reduce((acc, item) => {
            return acc + item.price * item.quantity;
        }, 0);

        let total = subtotal;
        if (get().coupon) {
            const discount = total * (get().coupon.discount / 100);
            total -= discount;
        }
        set({ subtotal, total });
    },

    removeFromCart: async (productId) => {
        try {
            await axios.delete(`/cart`, { data: { productId } });
            toast.success("Product removed from cart");

            set((prevState) => ({
                cart: prevState.cart.filter(
                    (item) => item._id !== productId,
                ),
            }));

            get().calcuteTotal();
        } catch (error) {
            console.log("Error from removeFromCart: ", error);
            toast.error(
                error.response.data.error ||
                    "Failed to remove product from cart",
            );
        }
    },

    updateQuantity: async (productId, quantity) => {
        try {
            if (quantity === 0) {
                await get().removeFromCart(productId);
                return;
            }

            await axios.put("/cart", { productId, quantity });
            toast.success("Product quantity updated");

            set((prevState) => ({
                cart: prevState.cart.map((item) =>
                    item._id === productId
                        ? { ...item, quantity: quantity }
                        : item,
                ),
            }));
            get().calcuteTotal();
        } catch (error) {
            console.log("Error from updateQuantity: ", error);
            toast.error(
                error.response.data.error ||
                    "Failed to update product quantity",
            );
        }
    },
}));
