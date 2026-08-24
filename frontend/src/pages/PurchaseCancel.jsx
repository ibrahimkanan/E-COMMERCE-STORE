import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft } from "lucide-react";

const PurchaseCancel = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
            <motion.div
                className="neumorphism max-w-md w-full p-6 sm:p-10 relative z-10 space-y-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Top Badge Icon */}
                <div className="flex justify-center">
                    <motion.div
                        className="neumorphism-badge w-20 h-20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1,
                        }}
                    >
                        <XCircle className="w-10 h-10 text-red-500" />
                    </motion.div>
                </div>

                {/* Header Text */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
                        Purchase Canceled
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Your order has been canceled and you haven't been charged.
                    </p>
                </div>

                {/* Info Inset Card */}
                <div className="neumorphism-inset p-5 space-y-2 text-left">
                    <p className="text-sm text-gray-700">
                        If you encountered an issue during checkout or changed your mind, 
                        don't worry! Your items are still safely waiting in your cart.
                    </p>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <Link
                            to="/cart"
                            className="neumorphism-button w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-800"
                        >
                            <ArrowLeft size={18} className="text-gray-600" />
                            Return to Cart
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default PurchaseCancel;
