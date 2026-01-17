const mongoose = require("mongoose");

const collectionWallpaperSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true, // ⚡ faster user queries
        },

        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
            required: true,
            index: true, // ⚡ faster collection queries
        },

        wallpaperId: {
            type: String,
            required: true,
        },

        src: {
            type: String,
            required: true, // 🔐 always validated via middleware
        },

        alt: {
            type: String,
            default: "",
        },

        createdAt: {
            type: Date,
            default: Date.now,
            index: true, // ⚡ sorting / recent queries
        },
    },
    {
        timestamps: false,
        versionKey: false,
    }
);

/* =========================
   INDEXES (PERFORMANCE + SAFETY)
========================= */

// ⚡ fast fetch for one collection
collectionWallpaperSchema.index({
    userId: 1,
    collectionId: 1,
});

// ❗ prevent duplicate wallpaper in same collection
collectionWallpaperSchema.index(
    {
        userId: 1,
        collectionId: 1,
        wallpaperId: 1,
    },
    { unique: true }
);

module.exports = mongoose.model(
    "CollectionWallpaper",
    collectionWallpaperSchema
);
