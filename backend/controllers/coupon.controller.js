import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({
            userId: req.user.id,
            isActive: true,
        });
        return res.json(coupon || null);
    } catch (error) {
        console.log("Error in getting coupons:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({
            userId: req.user.id,
            isActive: true,
            code: code,
        });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        if (coupon.expiryDate < Date.now()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({ message: "Coupon has expired" });
        }
        return res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        });
    } catch (error) {
        console.log("Error in validating coupon:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
    