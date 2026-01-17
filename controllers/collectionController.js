const Collection = require("../models/Collection");

exports.getCollections = async (req, res) => {
    await Collection.findOneAndUpdate(
        { userId: req.user.id, name: "Favorites" },
        { $setOnInsert: { userId: req.user.id, name: "Favorites" } },
        { upsert: true }
    );

    const collections = await Collection.find({
        userId: req.user.id,
    })
        .sort({ createdAt: 1 })
        .lean(); // ⚡

    res.json({ collections });
};

exports.createCollection = async (req, res) => {
    const { name } = req.body;

    if (!name?.trim()) {
        res.status(400);
        throw new Error("Collection name required");
    }

    try {
        const collection = await Collection.create({
            userId: req.user.id,
            name: name.trim(),
        });

        res.status(201).json({ success: true, collection });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400);
            throw new Error("Collection already exists");
        }
        res.status(500);
        throw new Error("Create failed");
    }
};
