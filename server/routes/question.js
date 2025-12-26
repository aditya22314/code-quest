import express from "express";
import { AskQuestion, deletequestion, getAllQuestions, votequestion } from "../controller/question.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/ask",AskQuestion);
router.get("/getallquestions",getAllQuestions);
router.delete("/delete/:id", auth, deletequestion);
router.patch("/vote/:id", auth, votequestion);

export default router;
