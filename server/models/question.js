import mongoose from "mongoose"

const questionSchema = mongoose.Schema({
    questionTitle: {type: String, required: true},
    questionBody: {type: String, required: true},
    questionTags: [String],
    noOfAnswers: {type: Number, default: 0},
    upvotes: [String],
    downvotes: [String],
    userPosted: {type: String, required: true},
    userId: {type: String, required: true},
    joinDate: {type: Date, default: Date.now},
    askedOn: {type: Date, default: Date.now},
    answer: [{
        answerBody: String,
        userAnswered: String,
        userId: String,
        askedOn: { type: Date, default: Date.now },
    }]

})

export default mongoose.model("Question", questionSchema);