const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// ❗ One user cannot have duplicate collection names
collectionSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Collection", collectionSchema);
