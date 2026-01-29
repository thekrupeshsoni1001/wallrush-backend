const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const savedRoutes = require("./routes/savedRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const collectionWallpaperRoutes = require("./routes/collectionWallpaperRoutes");

const rateLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

/* =====================
   GLOBAL MIDDLEWARE
===================== */
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            process.env.FRONTEND_URL,
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api", rateLimiter);

/* =====================
   ROUTES
===================== */
app.use("/api/auth", authRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/collection-wallpapers", collectionWallpaperRoutes);

// /* 🔥 FINAL FIX */
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =====================
   ERROR HANDLER
===================== */
app.use(errorHandler);

/* =====================
   DB + SERVER
===================== */
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });
