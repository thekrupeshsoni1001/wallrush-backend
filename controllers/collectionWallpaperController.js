const CollectionWallpaper = require("../models/CollectionWallpaper");

/* =========================
   ADD WALLPAPER TO COLLECTION
========================= */
exports.addToCollection = async (req, res) => {
    const userId = req.user.id;
    const { collectionId } = req.body;

    const wallpaper =
        req.body.wallpaper || {
            wallpaperId: req.body.wallpaperId,
            src: req.body.src,
            alt: req.body.alt,
        };

    if (!collectionId || !wallpaper?.wallpaperId) {
        res.status(400);
        throw new Error("Missing data");
    }

    try {
        const doc = await CollectionWallpaper.create({
            userId,
            collectionId,
            wallpaperId: wallpaper.wallpaperId,
            src: wallpaper.src?.original || wallpaper.src,
            alt: wallpaper.alt || "",
        });

        res.status(201).json(doc);
    } catch (err) {
        if (err.code === 11000) {
            res.status(409);
            throw new Error("Wallpaper already exists in this collection");
        }
        res.status(500);
        throw new Error("Server error");
    }
};

/* =========================
   GET WALLPAPERS (PAGINATED)
========================= */
exports.getCollectionWallpapers = async (req, res) => {
    const { collectionId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const wallpapers = await CollectionWallpaper.find({
        userId: req.user.id,
        collectionId,
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // ⚡

    const total = await CollectionWallpaper.countDocuments({
        userId: req.user.id,
        collectionId,
    });

    res.json({
        wallpapers,
        page,
        totalPages: Math.ceil(total / limit),
        total,
    });
};

/* =========================
   REMOVE WALLPAPER
========================= */
exports.removeFromCollection = async (req, res) => {
    const result = await CollectionWallpaper.deleteOne({
        _id: req.params.id,
        userId: req.user.id,
    });

    if (!result.deletedCount) {
        res.status(404);
        throw new Error("Wallpaper not found");
    }

    res.json({ success: true });
};

/* =========================
   BULK MOVE
========================= */
exports.bulkMove = async (req, res) => {
    const { wallpaperIds, targetCollectionId } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(wallpaperIds) || !targetCollectionId) {
        res.status(400);
        throw new Error("Invalid payload");
    }

    const docs = wallpaperIds.map((wallpaperId) => ({
        userId,
        collectionId: targetCollectionId,
        wallpaperId,
    }));

    await CollectionWallpaper.insertMany(docs, { ordered: false });

    res.json({ success: true });
};

/* =========================
   BULK DELETE
========================= */
exports.bulkDelete = async (req, res) => {
    const { ids } = req.body;

    if (!ids?.length) {
        res.status(400);
        throw new Error("Nothing selected");
    }

    await CollectionWallpaper.deleteMany({
        _id: { $in: ids },
        userId: req.user.id,
    });

    res.json({ success: true });
};
