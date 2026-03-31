import db from "../lib/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = "mysecretkey";

export const signup = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  const name = req.body.name?.trim();

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ error: "Please enter a valid email" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await db.get("SELECT id FROM users WHERE email = ?", [email]);

    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      "INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)",
      [crypto.randomUUID(), email, hashedPassword, name]
    );

    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Unable to create user right now" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie(
        "token", token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge: 24 * 60 * 60 * 1000,
   })
   .json({ message: "Login Successful"})

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const  logout = async (req, res) => {
  res.clearCookie("token")
  .json({ message: "Logout out sucessfully"})
}
