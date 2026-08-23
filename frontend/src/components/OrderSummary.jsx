import { motion } from "framer-motion";
import { useCartStore } from "../store/useCartStore.js";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import toast from "react-hot-toast";

const OrderSummary = () => {
    const { total, subtotal, coupon, isCouponApplied } = useCartStore();

    const savings = subtotal - total;
    const formattedSubtotal = subtotal.toFixed(2);
    const formattedTotal = total.toFixed(2);
    const formattedSavings = savings.toFixed(2);

    const handlePayment = async (e) => {
        e.preventDefault();
        console.log("Payment clicked");
        toast.success("Payment clicked");
    };

    return (
        <motion.div
            className="space-y-4 rounded-lg p-4 sm:p-6 neumorphism"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className="text-xl font-semibold text-gray-800">Order summary</p>

            <div className="space-y-4">
                <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-600">
                            Original price
                        </dt>
                        <dd className="text-base font-medium text-gray-800">
                            ${formattedSubtotal}
                        </dd>
                    </dl>

                    {savings > 0 && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-600">
                                Savings
                            </dt>
                            <dd className="text-base font-medium text-emerald-600">
                                -${formattedSavings}
                            </dd>
                        </dl>
                    )}

                    {coupon && isCouponApplied && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-600">
                                Coupon ({coupon.code})
                            </dt>
                            <dd className="text-base font-medium text-emerald-600">
                                -{coupon.discountPercentage}%
                            </dd>
                        </dl>
                    )}
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-300 pt-2">
                        <dt className="text-base font-bold text-gray-800">
                            Total
                        </dt>
                        <dd className="text-base font-bold text-emerald-600">
                            ${formattedTotal}
                        </dd>
                    </dl>
                </div>

                <motion.button
                    className="flex w-full items-center justify-center neumorphism-button text-sm font-medium py-2.5 text-emerald-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePayment}
                >
                    Proceed to Checkout
                </motion.button>

                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-600">
                        or
                    </span>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 underline hover:text-emerald-700 hover:no-underline"
                    >
                        Continue Shopping
                        <MoveRight size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};
export default OrderSummary;
