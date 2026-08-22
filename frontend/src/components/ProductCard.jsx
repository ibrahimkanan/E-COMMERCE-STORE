import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../store/useUserStore.js";
import { useCartStore } from "../store/useCartStore";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
    const { user } = useUserStore();
    const { addToCart } = useCartStore();
    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add products to cart", {
                id: "cart-error",
            });
            return;
        }
        addToCart(product);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex w-full aspect-square min-h-[440px] relative flex-col rounded-3xl neumorphism p-4 bg-[#e6e6e6]"
        >
            <div className="relative flex-1 min-h-0 rounded-2xl p-2 bg-[#e0e0e0] shadow-[inset_4px_4px_8px_#b8b8b8,inset_-4px_-4px_8px_#ffffff]">
                <img
                    className="object-cover w-full h-full rounded-xl"
                    src={product.image}
                    alt={product.name}
                />
            </div>

            <div className="mt-4 flex flex-col flex-none">
                <h5 className="text-xl font-semibold tracking-tight text-gray-800 line-clamp-1">
                    {product.name}
                </h5>
                <div className="mt-1 mb-3 flex items-center justify-between">
                    <p>
                        <span className="text-2xl font-bold text-gray-900">
                            ${product.price}
                        </span>
                    </p>
                </div>
                <div>
                    <button
                        className="flex items-center justify-center w-full neumorphism-button font-medium py-2.5"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={22} className="mr-2" />
                        Add to cart
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
export default ProductCard;
