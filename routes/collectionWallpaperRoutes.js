const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const validateImage = require("../middleware/validateImage");

const {
    addToCollection,
    getCollectionWallpapers,
    removeFromCollection,
    bulkMove,
    bulkDelete,
} = require("../controllers/collectionWallpaperController");


// ✅ ADD validateImage where image data enters
router.post(
    "/",
    protect,
    validateImage,      // 🔐 image URL + payload validation
    addToCollection
);

router.get(
    "/:collectionId",
    protect,
    getCollectionWallpapers
);

router.delete(
    "/:id",
    protect,
    removeFromCollection
);

router.post(
    "/bulk-move",
    protect,
    validateImage,      // 🔐 bulk image payload protection
    bulkMove
);

router.post(
    "/bulk-delete",
    protect,
    bulkDelete           // ❌ no validateImage needed (IDs only)
);

module.exports = router;
