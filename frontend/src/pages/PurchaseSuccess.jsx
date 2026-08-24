import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle,
    HandHeart,
    PackageCheck,
    Clock,
    AlertCircle,
    Loader,
    ShoppingBag,
} from "lucide-react";
import Confetti from "react-confetti";
import { useCartStore } from "../store/useCartStore.js";
import axios from "../lib/axios.js";

const PurchaseSuccess = () => {
    const [isProcessing, setIsProcessing] = useState(true);
    const [orderId, setOrderId] = useState(null);
    const [error, setError] = useState(null);
    const { clearCart } = useCartStore();

    useEffect(() => {
        const handleCheckoutSuccess = async (sessionId) => {
            try {
                const res = await axios.post("/payments/checkout-success", {
                    sessionId,
                });
                if (res.data?.orderId) {
                    setOrderId(res.data.orderId);
                }
                clearCart();
            } catch (err) {
                console.error("Error processing checkout success:", err);
                setError(
                    err.response?.data?.message ||
                        "Failed to process order confirmation.",
                );
            } finally {
                setIsProcessing(false);
            }
        };

        const sessionId = new URLSearchParams(window.location.search).get(
            "session_id",
        );
        if (sessionId) {
            handleCheckoutSuccess(sessionId);
        } else {
            setTimeout(() => {
                setIsProcessing(false);
                setError("No session ID found in the URL.");
            }, 0);
        }
    }, [clearCart]);

    // Loading State
    if (isProcessing) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <motion.div
                    className="neumorphism max-w-md w-full p-8 text-center space-y-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex justify-center">
                        <div className="neumorphism-badge w-16 h-16">
                            <Loader className="h-8 w-8 text-emerald-600 animate-spin" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Processing Your Order
                    </h2>
                    <p className="text-sm text-gray-600">
                        Please wait a moment while we confirm your payment details...
                    </p>
                </motion.div>
            </div>
        );
    }

    // Error State
    if (error) {
        console.log(error);
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <motion.div
                    className="neumorphism max-w-md w-full p-8 text-center space-y-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center">
                        <div className="neumorphism-badge w-16 h-16">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Unable to Verify Order
                    </h2>
                    <div className="neumorphism-inset p-4">
                        <p className="text-sm text-red-600 font-medium">
                            {error}
                        </p>
                    </div>
                    <p className="text-xs text-gray-500">
                        If you believe you were charged, please check your email
                        or contact customer support.
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/cart"
                            className="neumorphism-button w-full inline-flex items-center justify-center gap-2 text-emerald-700 font-semibold py-2.5"
                        >
                            <ShoppingBag size={18} />
                            Return to Cart
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Success State
    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                gravity={0.12}
                numberOfPieces={450}
                recycle={false}
                style={{ position: "fixed", top: 0, left: 0, zIndex: 50, pointerEvents: "none" }}
            />

            <motion.div
                className="neumorphism max-w-lg w-full p-6 sm:p-10 relative z-10 space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
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
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </motion.div>
                </div>

                {/* Header Text */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
                        Purchase Successful!
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Thank you for your order. We&apos;re preparing it for shipment.
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-emerald-700">
                        A confirmation receipt has been sent to your email.
                    </p>
                </div>

                {/* Order Details Inset Card */}
                <div className="neumorphism-inset p-5 space-y-3.5">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                            <PackageCheck size={16} className="text-gray-600" />
                            Order reference
                        </span>
                        <span className="font-semibold text-gray-800 font-mono">
                            {orderId ? `#${orderId.slice(-8).toUpperCase()}` : "#CONFIRMED"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                            <Clock size={16} className="text-gray-600" />
                            Estimated delivery
                        </span>
                        <span className="font-semibold text-emerald-700">
                            3-5 business days
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-300">
                        <span className="text-gray-500">Payment status</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Paid & Verified
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    <motion.button
                        type="button"
                        className="neumorphism-button w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-emerald-700"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <HandHeart size={18} />
                        Thanks for trusting us!
                    </motion.button>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <Link
                            to="/"
                            className="neumorphism-button w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700"
                        >
                            Continue Shopping
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default PurchaseSuccess;
