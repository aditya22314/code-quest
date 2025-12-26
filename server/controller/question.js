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