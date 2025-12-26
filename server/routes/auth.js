import express from "express";
import { Signup, Login, getAllUsers, updateProfile, getUserProfile } from "../controller/auth.js";

const router = express.Router();

router.post("/signup",Signup);
router.post("/login",Login);
router.get("/getallusers",getAllUsers);
router.get("/getuser/:id",getUserProfile);
router.patch("/updateprofile/:id",updateProfile);

export default router;
