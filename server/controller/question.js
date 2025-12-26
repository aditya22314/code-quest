import mongoose from "mongoose";
import question from "../models/question.js";

export const AskQuestion = async (req, res) => {
    const postQuestionData = req.body;
    const postQues = new question(postQuestionData);
    try {
        await postQues.save();
        res.status(200).json("Posted a question successfully");
    } catch (error) {
        console.log("Validation/Database Error:", error.message);
        res.status(409).json({ message: error.message });
    }
}

export const getAllQuestions = async (req, res) => {
    try {
        const questionsList = await question.find();
        res.status(200).json(questionsList);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deletequestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  try {
    await question.findByIdAndDelete(_id);
    res.status(200).json({ message: "question deleted" });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const votequestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value } = req.body;
  const userid = req.userId; // Provided by auth middleware

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  try {
    const questionDoc = await question.findById(_id);
    const upindex = questionDoc.upvotes.findIndex((id) => id === String(userid));
    const downindex = questionDoc.downvotes.findIndex(
      (id) => id === String(userid)
    );

    if (value === "upvote") {
      if (downindex !== -1) {
        questionDoc.downvotes = questionDoc.downvotes.filter(
          (id) => id !== String(userid)
        );
      }
      if (upindex === -1) {
        questionDoc.upvotes.push(userid);
      } else {
        questionDoc.upvotes = questionDoc.upvotes.filter((id) => id !== String(userid));
      }
    } else if (value === "downvote") {
      if (upindex !== -1) {
        questionDoc.upvotes = questionDoc.upvotes.filter((id) => id !== String(userid));
      }
      if (downindex === -1) {
        questionDoc.downvotes.push(userid);
      } else {
        questionDoc.downvotes = questionDoc.downvotes.filter(
          (id) => id !== String(userid)
        );
      }
    }
    const questionvote = await question.findByIdAndUpdate(_id, questionDoc, { new: true });
    res.status(200).json(questionvote);
  } catch (error) {
    console.log(error)
    res.status(500).json("something went wrong..");
    return;
  }
};