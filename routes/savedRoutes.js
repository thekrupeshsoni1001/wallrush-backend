const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const validateImage = require("../middleware/validateImage");

const {
    saveWallpaper,
    getSavedWallpapers,
    deleteSavedWallpaper,
} = require("../controllers/savedController");

router.post("/save", protect, validateImage, saveWallpaper);
router.get("/", protect, getSavedWallpapers);
router.delete("/:id", protect, deleteSavedWallpaper);

module.exports = router;
