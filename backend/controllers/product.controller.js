import Product from "../models/Product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); // empty object means find all documents
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error in getting all products:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        // check redis cache first
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.status(200).json(JSON.parse(featuredProducts));
        }

        // if not found in cache, fetch from database
        featuredProducts = await Product.find({ isFeatured: true }).lean(); //lean returns plain javascript objects instead of mongoose documents

        if (!featuredProducts || featuredProducts.length === 0) {
            return res
                .status(404)
                .json({ message: "No featured products found" });
        }

        // store in cache
        await redis.set("featured_products", JSON.stringify(featuredProducts));

        return res.status(200).json(featuredProducts);
    } catch (error) {
        console.log("Error in getting featured products:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            try {
                cloudinaryResponse = await cloudinary.uploader.unsigned_upload(
                    image,
                    "products",
                    { folder: "products" },
                );
            } catch (uploadError) {
                console.log("Cloudinary upload failed:", uploadError.message);
                // Continue creating the product without an image
            }
        }

        // create product
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url
                ? cloudinaryResponse.secure_url
                : "",
            category,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Error in creating product:", error.message);
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // delete image from cloudinary
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted successfully from cloudinary");
            } catch (error) {
                console.log(
                    "Error in deleting image from cloudinary:",
                    error.message,
                );
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        return res
            .status(200)
            .json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in deleting product:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: {
                    size: 3,
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                },
            },
        ]);

        res.status(200).json(products);
    } catch (error) {
        console.log("Error in getting recommended products:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        return res.status(200).json({ products });
    } catch (error) {
        console.log("Error in getting products by category:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();

        await updateFeaturedProductsCache();

        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.log("Error in toggling featured product:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateFeaturedProductsCache = async () => {
    try {
        const featuredProducts = await Product.find({
            isFeatured: true,
        }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log(
            "Error in updating featured products cache:",
            error.message,
        );
    }
};
