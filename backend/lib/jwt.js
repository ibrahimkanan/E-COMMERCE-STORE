import jwt from "jsonwebtoken";
import { redis } from "./redis.js";

export const generateToken = (userId) => {
    try {
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign(
            { userId },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: "7d",
            },
        );
        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Error generating token:", error);
    }
};

export const storeRefreshToken = async (userId, refreshToken) => {
    try {
        await redis.set(
            `refresh:${userId}`,
            refreshToken,
            { ex: 7 * 24 * 60 * 60 }, 
        );
    } catch (error) {
        console.log("Error storing refresh token:", error);
    }
};

export const setCookies = (res, accessToken, refreshToken) => {
    try {
        res.cookie("access_token", accessToken, {
            httpOnly: true, // prevent XSS attacks
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", // prevent CSRF attacks
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    } catch (error) {
        console.log("Error setting cookies:", error);
    }
};
