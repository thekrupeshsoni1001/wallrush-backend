const mongoose = require("mongoose");

const savedWallpaperSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    wallpaperId: String,
    src: String,
    alt: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// 🔐 prevent duplicate saves
savedWallpaperSchema.index(
    { userId: 1, wallpaperId: 1 },
    { unique: true }
);

// ⚡ fast user saved queries
savedWallpaperSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model(
    "SavedWallpaper",
    savedWallpaperSchema
);
