// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendSignupWebhook } = require("../controllers/auth-controller");

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = "7d";


// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
    });

    // Fire webhook (non-blocking)
    sendSignupWebhook(user);

    return res.json({ success: true, user });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({ token, user: { id: user._id, email: user.email } });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const token = (req.headers.authorization || "").split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ user });

  } catch (err) {
    console.error("Token validation error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
