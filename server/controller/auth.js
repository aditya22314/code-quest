import mongoose from "mongoose";
import Users from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Signup = async(req,res) => {
 const { name,email,password }  = req.body;
  try {
   const existingUser = await Users.findOne({email});
   if(existingUser){
    return res.status(400).json({message:"User already exists"});
   }
   else {
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = await Users.create({name,email,password:hashedPassword});
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).json({ result: newUser, token });
   }
  } 
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Something went wrong"});
  } 
}

export const Login = async(req,res) => {
 const { email,password }  = req.body;
  try {
    const existingUser = await Users.findOne({email});
    if(!existingUser){
      return res.status(404).json({message:"User not found"});
    }
    const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
    if(!isPasswordCorrect){
      return res.status(400).json({message:"Invalid credentials"});
    }
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ result: existingUser, token });
  } 
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Something went wrong"});
  } 
}

export const getAllUsers = async(req,res) => {
  try {
     const users = await Users.find();
     return res.status(200).json(users);
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Something went wrong"});
  }
}

export const updateProfile = async(req,res) => {
  const { id:_id } = req.params;
  const { name,about,tags } = req.body;
  if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"User not found"});
  try {
    const updatedUser = await Users.findByIdAndUpdate(_id,{name,about,tags},{new:true});
    return res.status(200).json(updatedUser);
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Something went wrong"});
  }
}

export const getUserProfile = async(req,res) => {
  const { id:_id } = req.params;
  if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"User not found"});
  try {
    const userProfile = await Users.findById(_id);
    return res.status(200).json(userProfile);
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Something went wrong"});
  }
}