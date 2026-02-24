import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user || !user.password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = generateToken(user);
  
      res.json({
        success: true,
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
};

export const googleLogin = async (req, res, next) => {
    try {
      const { token } = req.body;
  
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
  
      const { sub, email, name, picture } = payload;
  
      let user = await User.findOne({ email });
  
      if (!user) {
        user = await User.create({
          name,
          email,
          googleId: sub,
          avatar: picture,
        });
      }
  
      const jwtToken = generateToken(user);
  
      res.json({
        success: true,
        token: jwtToken,
        user,
      });
    } catch (error) {
      next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };