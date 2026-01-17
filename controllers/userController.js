const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* ============================
   UPDATE PROFILE CONTROLLER
============================ */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { name, password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update name
        if (name) user.name = name;

        // Update password
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            user.password = hashed;
        }

        // Update profile image
        if (req.file) {
            user.profile = `/uploads/${req.file.filename}`;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profile: user.profile,
            },
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Profile update failed" });
    }
};
