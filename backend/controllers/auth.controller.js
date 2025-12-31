import bcryptjs from "bcryptjs";
import {User} from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
export async function signup(req, res){
    try {
        const {username, email, password} = req.body
        if(!username || !email || !password){
            return res.status(400).json({success:false, message:"All fields are required"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({success:false, message:"Invalid email format"});
        }
        if(password.length < 6){
            return res.status(400).json({success:false, message:"Password should be at least 6 characters"});
        }

        const existingUserBYEmail = await User.findOne({email});
        if(existingUserBYEmail){
            return res.status(400).json({success:false, message:"User already exists"});
        }

        const existingUserByUsername = await User.findOne({username});

        if(existingUserByUsername){
            return res.status(400).json({success:false, message:"Username already exists"});
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

        const randomIndex = Math.floor(Math.random() * PROFILE_PICS.length);
        const randomProfilePic = PROFILE_PICS[randomIndex];

        const newUser = new User({username, email, password: hashedPassword, image: randomProfilePic}); // Create a new user

            generateTokenAndSetCookie(res, newUser._id);
            await newUser.save(); // Save the new user to the database
            res.status(201).json({
                success:true,
                user:{
                    ...newUser._doc,
                    password:""
    
                }
            })

        
    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}
export async function login(req, res){
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({success:false, message:"All fields are required" })
        }
        
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if(!isMatch){
            console.log("password not match");
            return res.status(400).json({success:false, message:"Invalid credentials"});
        }
        generateTokenAndSetCookie(res, user._id);
        res.status(200).json({
            success:true,
            user:{
                ...user._doc,
                password:""
            }
        })
    } catch (error) {
        console.log("error in login", error.message);
        res.status(500).json({success:false, message:"Internal server error"});

        
    }
}
export async function logout(req, res){
    try{
        res.clearCookie("jwt-netflix");
        res.status(200).json({success:true, message:"Logout success"});

    }catch(error){
        res.status(500).json({success:false, message:"Internal server error"});
    }
}


export async function authCheck(req, res){
    try {
        console.log("Auth check user:", req.user);
        res.status(200).json({success:true, user:req.user});
        
    } catch (error) {
        console.log("Error in authCheck:", error.message);
        res.status(500).json({success:false, message:"Internal server error in authCheck"});
        
    }
}