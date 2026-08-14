import User from "../models/user.model.js";
import { generateToken, storeRefreshToken, setCookies } from "../lib/jwt.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        // authenticate the user
        const { accessToken, refreshToken } = generateToken(user._id);

        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        if (user && (await user.comparePassword(password))) {
            // generate tokens
            const { accessToken, refreshToken } = generateToken(user._id);

            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            return res.status(200).json({
                message: "User logged in successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } else {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log("Error in login: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token found" });
        }
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
        );
        await redis.del(`refresh:${decoded.userId}`);

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("error in logout: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// refresh the access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token found" });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
        );

        // check if the refresh token is stored in redis
        const storedRefreshToken = await redis.get(`refresh:${decoded.userId}`);
        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            return res
                .status(401)
                .json({ message: "Invalid or expired refresh token" });
        }

        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" },
        );

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({
            message: "Access token refreshed successfully",
        });
    } catch (error) {
        console.log("Error in refresh token: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in get user profile: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
