import mongoose from "mongoose";
import User from "../models/auth.js";
import Post from "../models/post.js";

export const createPost = async (req, res) => {
  const { content, media } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const friendCount = user.friends?.length || 0;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if we need to reset the count for a new day
    if (!user.lastPostDate || user.lastPostDate < today) {
      user.dailyPostCount = 0;
    }

    // Posting Limits Logic
    let limit = 1; // Default for 0-1 friends
    if (friendCount >= 2 && friendCount <= 10) {
      limit = friendCount;
    } else if (friendCount > 10) {
      limit = Infinity;
    }

    if (user.dailyPostCount >= limit) {
      return res.status(403).json({ message: `Daily post limit of ${limit} reached. Add more friends to post more!` });
    }

    const newPost = new Post({
      userId,
      userName: user.name,
      content,
      media,
    });

    await newPost.save();
    
    user.dailyPostCount += 1;
    user.lastPostDate = now;
    await user.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addFriend = async (req, res) => {
  const { id: friendId } = req.params;
  const userId = req.userId;

  if (userId === friendId) return res.status(400).json({ message: "You cannot add yourself as a friend" });

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ message: "User not found" });

    if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Already friends" });
    }

    user.friends.push(friendId);
    friend.friends.push(userId); // Mutual friendship

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");

  try {
    const post = await Post.findById(id);
    const index = post.likes.findIndex((id) => id === String(userId));

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(userId));
    }

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { commentBody } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    const post = await Post.findById(id);

    post.comments.push({ userId, userName: user.name, commentBody });
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
