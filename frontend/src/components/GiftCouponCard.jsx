import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import toast from "react-hot-toast";

const GiftCouponCard = () => {
    const [userInputCode, setUserInputCode] = useState("");
    const { coupon, isCouponApplied, removeCoupon, applyCoupon, getMyCoupon } =
        useCartStore();

    useEffect(() => {
        getMyCoupon();
    }, [getMyCoupon]);

    useEffect(() => {
        if (coupon) {
            setTimeout(() => {
                setUserInputCode(coupon.code);
            }, 1200);
        }
    }, [coupon]);

    const handleApplyCoupon = async () => {
        try {
            if (!userInputCode) {
                toast.error("Please enter a coupon code");
                return;
            }
            await applyCoupon(userInputCode);
            setUserInputCode("");
        } catch (error) {
            console.log("Error from handleApplyCoupon: ", error);
            toast.error(error.response.data.error || "Failed to apply coupon");
        }
    };

    const handleRemoveCoupon = async () => {
        try {
            await removeCoupon();
            setUserInputCode("");
        } catch (error) {
            console.log("Error from handleRemoveCoupon: ", error);
            toast.error(error.response.data.error || "Failed to remove coupon");
        }
    };

    return (
        <motion.div
            className="space-y-4 rounded-lg p-4 sm:p-6 neumorphism"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="voucher"
                        className="mb-2 block text-sm font-medium text-gray-800"
                    >
                        Do you have a voucher or gift card?
                    </label>
                    <input
                        type="text"
                        id="voucher"
                        className="neumorphism-input"
                        placeholder="Enter code here"
                        value={userInputCode}
                        onChange={(e) => setUserInputCode(e.target.value)}
                        required
                    />
                </div>

                <motion.button
                    type="button"
                    className="flex w-full items-center justify-center neumorphism-button text-sm font-medium py-2.5 text-emerald-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApplyCoupon}
                >
                    Apply Code
                </motion.button>
            </div>
            {isCouponApplied && coupon && (
                <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800">
                        Applied Coupon
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                        {coupon.code} - {coupon.discountPercentage}% off
                    </p>

                    <motion.button
                        type="button"
                        className="mt-2 flex w-full items-center justify-center neumorphism-button text-sm font-medium py-2.5 text-red-600"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRemoveCoupon}
                    >
                        Remove Coupon
                    </motion.button>
                </div>
            )}

            {coupon && (
                <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800">
                        Your Available Coupon:
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        {coupon.code} - {coupon.discountPercentage}% off
                    </p>
                </div>
            )}
        </motion.div>
    );
};
export default GiftCouponCard;
