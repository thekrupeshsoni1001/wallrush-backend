const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =======================
   REGISTER
======================= */
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: "Registration failed" });
    }
};

/* =======================
   LOGIN
======================= */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { name, email, picture } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                profile: picture,
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user
        });
    } catch (err) {
        res.status(500).json({ message: "Google login failed" });
    }
};


/* =======================
   UPDATE PROFILE
======================= */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const updates = {};

        if (req.body.name) updates.name = req.body.name;

        if (req.body.password) {
            const hashed = await bcrypt.hash(req.body.password, 10);
            updates.password = hashed;
        }

        if (req.file) {
            updates.profile = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true }
        );

        res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Profile update failed" });
    }
};
