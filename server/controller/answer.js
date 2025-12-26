import mongoose from "mongoose";
import question from "../models/question.js";

export const Askanswer = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  const { noOfAnswers, answerBody, userAnswered, userId } = req.body;
  updatenoOfAnswers(_id, noOfAnswers);

  try {
    const updatequestion = await question.findByIdAndUpdate(_id, {
      $addToSet: { answer: { answerBody, userAnswered, userId } },
    }, { new: true });
    res.status(200).json(updatequestion);
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};
const updatenoOfAnswers = async (_id, noOfAnswers) => {
  try {
    await question.findByIdAndUpdate(_id, { $set: { noOfAnswers: noOfAnswers } });
  } catch (error) {
    console.log(error);
  }
};
export const deleteanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { noOfAnswers, answerId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  if (!mongoose.Types.ObjectId.isValid(answerId)) {
    return res.status(400).json({ message: "answer unavailable" });
  }
  updatenoOfAnswers(_id, noOfAnswers);
  try {
    const updatequestion = await question.findByIdAndUpdate(
      _id,
      {
        $pull: { answer: { _id: answerId } },
      },
      { new: true }
    );
    res.status(200).json(updatequestion);
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};