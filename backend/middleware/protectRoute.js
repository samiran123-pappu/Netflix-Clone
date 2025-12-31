import jwt from "jsonwebtoken";
import {ENV_VARS} from "../config/envVars.js";
import {User} from "../models/user.model.js";


export const protectRoute = async(req, res, next)=>{
    try {
        const token = req.cookies["jwt-netflix"];
    if(!token){
        return res.status(401).json({ success:false, message:"Unauthorized access - NO TOKEN"});
    }

    const decoded =jwt.verify(token, ENV_VARS.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({success:false, message:"Unauthorized access - INVLID TOKEN"});
    }

    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
        return res.status(401).json({success:false, message:"Unauthorized access - NO USER"});
    }

    req.user = user;
    next();
        
    } catch (error) {
        console.log("Error in the protectRoute middleware", error.message);
        return res.status(500).json({success:false, message:"Internal server error in the protectRoute middleware"});
        
    }
}