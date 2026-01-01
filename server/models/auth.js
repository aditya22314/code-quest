import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    about: String,
    tags: [String],
    joinDate: {type: Date, default: Date.now},
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastPostDate: { type: Date },
    dailyPostCount: { type: Number, default: 0 }
})

export default mongoose.model("User", userSchema);