import Product from "../models/Product.model.js";

export const getCart = async (req, res) => {
    try {
        const products = await Product.find({
            _id: { $in: req.user.cartItems },
        });

        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find(
                (item) => item.id === product._id,
            );
            return { ...product.toJSON(), quantity: item.quantity };
        });

        res.status(200).json(cartItems);
    } catch (error) {
        console.log("Error getting cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const user = req.user;

        const existingItem = user.cartItems.find(
            (item) => item.id === productId,
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }

        await user.save();

        res.status(200).json({ message: "Item added to cart successfully" });
    } catch (error) {
        console.log("Error adding to cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(
                (item) => item.id !== productId,
            );
        }
        await user.save();
        res.status(200).json({
            message: "Item removed from cart successfully",
        });
    } catch (error) {
        console.log("Error removing from cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;

        const user = req.user;

        const existingItem = user.cartItems.find(
            (item) => item.id === productId,
        );

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(
                    (item) => item.id !== productId,
                );
            }

            existingItem.quantity = quantity;
            await user.save();
            res.status(200).json({ message: "Quantity updated successfully" });
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        console.log("Error updating quantity:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
