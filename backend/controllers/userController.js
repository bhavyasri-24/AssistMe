import User from "../models/user.models.js"
import bcrypt from "bcrypt"
import cloudinary from "../config/cloudinary.js"

export const handleRegisterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export const handleGetUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const handleUpdateUserById = async (req, res) => {
  try {
    const { username, email, password, removeAvatar } = req.body;

    const user = await User.findById(req.params.id);


    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }


    if (req.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ error: "unauthorized" });
    }

    // 🔥 Basic fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    // 🔥 Remove avatar
    if (removeAvatar === "true") {
      user.avatar = null;
    }

    // 🔥 Upload new avatar
    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "avatars",
      });

      user.avatar = result.secure_url;
    }

    await user.save();

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleDeleteUserById = async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id && req.userRole !== "admin") {
      return res.status(401).json({ error: "unauthorized" });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "user not found" })
    }
    res.status(200).json({ message: "user deleted" });
  }
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const handleGetAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}
