
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: "./backend/.env" });

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());


// =====================================
// FRONTEND
// =====================================

app.use(express.static(path.join(__dirname, "frontend")));


// =====================================
// API ROUTES
// =====================================

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);


// =====================================
// HOME ROUTE
// =====================================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "frontend", "index.html")
    );
});


// =====================================
// MONGODB CONNECTION
// =====================================

mongoose.connect(process.env.MONGO_URI)

    .then(() => {

        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        });

    })

    .catch((error) => {

        console.log("MongoDB connection failed:");

        console.log(error.message);

    });

