import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (payload) => {
    return jwt.sign(
    {
      id: payload.id,
      // username: payload.username,
      userType: payload.user_type, // Ensure userType is included
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export default generateToken;