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

        if (name) user.name = name;

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            user.password = hashed;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Profile update failed" });
    }
};

