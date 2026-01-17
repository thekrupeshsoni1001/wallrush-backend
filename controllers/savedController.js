const SavedWallpaper = require("../models/SavedWallpaper");

exports.saveWallpaper = async (req, res) => {
    const { wallpaperId, src, alt } = req.body;

    if (!wallpaperId || !src) {
        res.status(400);
        throw new Error("Wallpaper data missing");
    }

    const exists = await SavedWallpaper.findOne({
        userId: req.user.id,
        wallpaperId,
    });

    if (exists) {
        res.status(400);
        throw new Error("Already saved");
    }

    const saved = await SavedWallpaper.create({
        userId: req.user.id,
        wallpaperId,
        src,
        alt,
    });

    res.status(201).json({ success: true, saved });
};

exports.getSavedWallpapers = async (req, res) => {
    const wallpapers = await SavedWallpaper.find({
        userId: req.user.id,
    })
        .sort({ createdAt: -1 })
        .lean(); // ⚡

    res.json({ wallpapers });
};

exports.deleteSavedWallpaper = async (req, res) => {
    const result = await SavedWallpaper.deleteOne({
        _id: req.params.id,
        userId: req.user.id,
    });

    if (!result.deletedCount) {
        res.status(404);
        throw new Error("Wallpaper not found");
    }

    res.json({ success: true });
};
