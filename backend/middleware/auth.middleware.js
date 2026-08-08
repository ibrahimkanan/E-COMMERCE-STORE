import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;

        if (!accessToken) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No access token provided" });
        }

        try {
            const decodedToken = jwt.verify(
                accessToken,
                process.env.JWT_SECRET,
            );

            const user = await User.findById(decodedToken.userId).select(
                "-password",
            );

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = user;

            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res
                    .status(401)
                    .json({ message: "Unauthorized - Token expired" });
            }

            throw error;
        }
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        return res
            .status(401)
            .json({ message: "Unuthorized - Invalid access Token" });
    }
};

export const adminRoute = (req, res, next) => {
    try {
        if (req.user && req.user.role === "admin") {
            next();
        } else {    
            return res
                .status(403)
                .json({ message: "Forbidden - Not an admin" });
        }
    } catch (error) {
        console.log("Error in adminRoute middleware:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
