import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export default generateRefreshToken;