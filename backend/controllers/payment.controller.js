import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

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
                quantity: product.quantity || 1,
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
                "/purchase-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: process.env.CLIENT_URL + "/purchase-cancel",
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
                products: JSON.stringify(
                    products.map((prod) => ({
                        id: prod._id,
                        price: prod.price,
                        quantity: prod.quantity,
                    })),
                ),
            },
        });

        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }

        res.status(200).json({
            id: session.id,
            url: session.url,
            totalAmount: totalAmount / 100,
        });
    } catch (error) {
        console.log("error in create checkout session: ", error);
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
    await Coupon.findOneAndDelete({ userId });
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId,
    });
    await newCoupon.save();
    return newCoupon.code;
};

export const checkoutSuccess = async (req, res) => {
    try {
        const sessionId = req.body.sessionId || req.query.sessionId;
        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    {
                        code: session.metadata.couponCode,
                        userId: session.metadata.userId,
                    },
                    { isActive: false },
                );
            }

            // Check if order already exists to prevent duplicates
            let existingOrder = await Order.findOne({
                stripeSessionId: session.id,
            });
            if (existingOrder) {
                return res.status(200).json({
                    success: true,
                    message: "Order already processed.",
                    orderId: existingOrder._id,
                });
            }

            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100, // convert to dollars
                stripeSessionId: session.id,
                paymentStatus: session.payment_status,
                paidAt: new Date(),
            });

            await newOrder.save();

            res.status(200).json({
                success: true,
                message: "Payment successful, order created.",
                orderId: newOrder._id,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment not completed",
            });
        }
    } catch (error) {
        console.log("error in checkout success: ", error);
        res.status(500).json({
            message: "Error processing successful checkout",
            error: error.message,
        });
    }
};
