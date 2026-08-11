import { stripe } from "../lib/stripe";
import Coupon from "../models/coupon.model";

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products are required" });
        }

        let totalAmount = 0;

        const lineItems = products.map((product) => {
            const amount = product.price * 100; // stipe want the price with cents
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity,
            };
        });

        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({
                code: couponCode,
                isActive: true,
                userId: req.user._id,
            });
            if (!coupon || !coupon.isActive) {
                return res.status(400).json({ message: "Invalid coupon code" });
            }

            if (coupon.isActive) {
                totalAmount -= Math.round(
                    (totalAmount * coupon.discountPercentage) / 100,
                );
            }
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            payment_method_types: ["card"],
            success_url:
                process.env.CLIENT_URL +
                "/payment/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: process.env.CLIENT_URL + "/payment/cancel",
            discounts: coupon
                ? [
                      {
                          coupon: await createStripeCoupon(
                              coupon.discountPercentage,
                          ),
                      },
                  ]
                : [],

            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
            },
        });

        if (totalAmount >= 20000) {  // create coupon if user spend more then 200$
            const newCouponCode = await createNewCoupon(req.user._id);
        }

        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createStripeCoupon = async (discountPercentage) => {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    });
    return coupon;
};

const createNewCoupon = async (userId) => {
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId,
    });
    await newCoupon.save();
    return newCoupon.code;
};
