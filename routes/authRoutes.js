const express = require("express");
const router = express.Router();

const {
    register,
    login,
    googleLogin,
} = require("../controllers/authController");

const { updateProfile } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
// const upload = require("../middleware/upload");

// ===========================
// AUTH ROUTES
// ===========================
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);

// ===========================
// PROFILE UPDATE
// ===========================
// router.put(
//     "/update-profile",
//     protect,
//     upload.single("profile"),
//     updateProfile
// );
router.put(
    "/update-profile",
    protect,
    updateProfile
);


module.exports = router;
