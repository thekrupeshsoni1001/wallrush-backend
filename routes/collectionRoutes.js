const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    getCollections,
    createCollection,
} = require("../controllers/collectionController");

router.get("/", protect, getCollections);
router.post("/", protect, createCollection);

module.exports = router;
