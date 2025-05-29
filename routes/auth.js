const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// POST /signup
router.post('/signup', async (req, res) => {
    const { firstName, dob, email, phoneNumber, password, confirmPassword } = req.body;

    if (password !== confirmPassword)
        return res.status(400).json({ msg: "Passwords do not match" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
        return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, dob, email, phoneNumber, password: hashedPassword });
    await user.save();
    res.status(201).json({ msg: "User created" });
});

// POST /login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

// GET all users
router.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// GET user by ID;
router.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
});

// PUT update user
router.put('/users/:id', async (req, res) => {
    const { firstName, dob, email, phoneNumber } = req.body;
    await User.findByIdAndUpdate(req.params.id, { firstName, dob, email, phoneNumber });
    res.json({ msg: "User updated" });
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
});

module.exports = router;
