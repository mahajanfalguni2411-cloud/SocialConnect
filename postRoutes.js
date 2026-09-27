
const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

const router = express.Router();


// =====================================
// CREATE POST
// =====================================

router.post("/", async (req, res) => {

    try {

        const { token, content } = req.body;

        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!content || content.trim() === "") {
            return res.status(400).json({
                message: "Post cannot be empty"
            });
        }

        const post = new Post({
            user: decoded.userId,
            content: content
        });

        await post.save();

        res.status(201).json({
            message: "Post created successfully",
            post: post
        });

    } catch (error) {

        console.error("Create post error:", error);

        res.status(500).json({
            message: "Failed to create post",
            error: error.message
        });
    }
});


// =====================================
// GET ALL POSTS
// =====================================

router.get("/", async (req, res) => {

    try {

        const posts = await Post.find()
            .populate("user", "name email")
            .populate("comments.user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {

        console.error("Get posts error:", error);

        res.status(500).json({
            message: "Failed to get posts",
            error: error.message
        });
    }
});


// =====================================
// LIKE / UNLIKE POST
// =====================================

router.post("/:postId/like", async (req, res) => {

    try {

        const { token } = req.body;

        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const post = await Post.findById(
            req.params.postId
        );

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const userId = decoded.userId.toString();

        const alreadyLiked = post.likes.some(
            id => id.toString() === userId
        );

        if (alreadyLiked) {

            post.likes = post.likes.filter(
                id => id.toString() !== userId
            );

        } else {

            post.likes.push(decoded.userId);

        }

        await post.save();

        res.json({
            message: alreadyLiked
                ? "Post unliked"
                : "Post liked",

            likes: post.likes.length
        });

    } catch (error) {

        console.error("Like error:", error);

        res.status(500).json({
            message: "Failed to like post",
            error: error.message
        });
    }
});


// =====================================
// ADD COMMENT
// =====================================

router.post("/:postId/comment", async (req, res) => {

    try {

        const { token, text } = req.body;

        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        if (!text || text.trim() === "") {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const post = await Post.findById(
            req.params.postId
        );

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        post.comments.push({
            user: decoded.userId,
            text: text.trim()
        });

        await post.save();

        res.status(201).json({
            message: "Comment added successfully"
        });

    } catch (error) {

        console.error("Comment error:", error);

        res.status(500).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
});

// =====================================
// DELETE POST
// =====================================

router.delete("/:postId", async (req, res) => {

    try {

        const { token } = req.body;

        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Check whether the logged-in user owns the post
        if (post.user.toString() !== decoded.userId.toString()) {
            return res.status(403).json({
                message: "You can only delete your own posts"
            });
        }

        await Post.findByIdAndDelete(req.params.postId);

        res.json({
            message: "Post deleted successfully"
        });

    } catch (error) {

        console.error("Delete post error:", error);

        res.status(500).json({
            message: "Failed to delete post",
            error: error.message
        });
    }
});
module.exports = router;

