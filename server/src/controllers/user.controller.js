import bcryptjs from "bcryptjs";
import { userModel } from "../models/user.model.js";
import { journalModel } from "../models/journalEntry.model.js";
import { generateToken,verifyAccessToken,verifyRefreshToken } from "../utils/jwt.token.js";

export const registerUser = async (req, res) => {

  const { name, email, password, phoneNumber } = req.body;

  email = email?.trim() || null;
  phoneNumber = phoneNumber?.trim() || null;

  if (!name || !password || name.trim() === "" || password.trim() === "") {
  return res.status(400).json({ statusCode: 400, message: "Name and password are required!" });
}

// Check if at least one of email or phoneNumber is provided
if ((!email || email.trim() === "") && (!phoneNumber || phoneNumber.trim() === "")) {
  return res.status(400).json({ statusCode: 400, message: "Either email or phone number is required!" });
}

  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ statusCode: 400, message: "Phone number must be 10 digits!" });
  }

  try {
    const queryConditions = [];
    if (email !== null) queryConditions.push({ email });
    if (phoneNumber !== null) queryConditions.push({ phoneNumber });

    const existingUser = await userModel.findOne({ $or: queryConditions });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please login to continue!",
        statusCode: 400
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashPassword, phoneNumber });
    await newUser.save();

    return res.status(200).json({ message: "User successfully registered!"});
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some(field => !field || field.trim() === "")) {
    return res.status(400).json({ statusCode: 400, message: "All fields are required!" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist, please register!", statusCode: 400 });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password!", statusCode: 400 });
    }

    const { accessToken, refreshToken } = generateToken(user);

   res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({ 
      message: "User successfully logged in!",
      accessToken 
    });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    // Generate new access token
    const accessToken = generateToken(decoded);
    
    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: "production",
      sameSite: "strict"
    });

    return res.status(200).json({ message: "User logged out successfully!" });
  } catch (e) {
    return res.status(500).json({ message: "Logout failed!", error: e });
  }
};

export const displayAllEntries = async (req, res) => {
  const { userId } = req.params;

  try {
    const entries = await journalModel.find({ user: userId });
    return res.status(200).json({ message: "All entries retrieved!", entries });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Server error while fetching profile' });
  }
};
