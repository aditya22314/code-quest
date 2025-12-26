import express from "express";
import { Signup, Login, getAllUsers, updateProfile, getUserProfile } from "../controller/auth.js";
import { AskQuestion, getAllQuestions } from "../controller/question.js";

const router = express.Router();

router.post("/ask",AskQuestion);
router.get("/getallquestions",getAllQuestions);

export default router;
