import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";

// App config
const app = express();
dotenv.config();

// Enable CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Connect to MongoDB
const connect = () => {
    mongoose.connect(process.env.MONGO)
        .then(() => {
            console.log("✅ Connected to MongoDB");
        })
        .catch((err) => {
            console.error("❌ MongoDB connection error:", err);
        });
};

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// Global error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({
        success: false,
        message,
        status,
    });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connect();
    console.log(`🚀 App is running on port ${PORT}`);
});





