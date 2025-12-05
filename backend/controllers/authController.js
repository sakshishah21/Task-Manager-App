const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      image: req.file ? "/uploads/" + req.file.filename : ""
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image
      },
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image
      },
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
