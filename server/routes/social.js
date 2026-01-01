import express from "express";
import auth from "../middleware/auth.js";
import { createPost, getFeed, addFriend, likePost, addComment } from "../controller/social.js";

const router = express.Router();

router.post("/post", auth, createPost);
router.get("/feed", getFeed);
router.post("/add-friend/:id", auth, addFriend);
router.patch("/like/:id", auth, likePost);
router.post("/comment/:id", auth, addComment);

export default router;
