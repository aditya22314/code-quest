import express from "express";


import auth from "../middleware/auth.js";
import { Askanswer, deleteanswer } from "../controller/answer.js";

const router = express.Router();

router.post("/postanswer/:id",auth, Askanswer);
router.delete("/delete/:id",auth,deleteanswer)


export default router;