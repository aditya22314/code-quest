import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/auth.js";
import questionRoutes from "./routes/question.js";
import answerroutes from "./routes/answer.js"
import socialRoutes from "./routes/social.js"

const app = express();

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cors({
    origin: true,
    credentials: true
}));
app.use("/user", userRoutes);
app.use("/question", questionRoutes);
app.use("/answer", answerroutes);
app.use("/social", socialRoutes);


app.get("/", (req, res) => {
    res.send("Stack overflow clone");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const databaseUrl = process.env.MONGODB_URI;

mongoose.connect(databaseUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error));
