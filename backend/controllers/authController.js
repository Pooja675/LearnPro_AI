import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d"
    })
}

// @desc Register a new user
// @route POST /api/auth/register
// @access public

export const register = async(req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // ✅ Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide username, email and password",
                statusCode: 400
            })
        }

        // ✅ Basic password strength check
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 6 characters",
                statusCode: 400
            })
        }

        // ✅ Check both email AND username for duplicates
        const userExists = await User.findOne({ $or: [{ email }, { username }] })

        if (userExists) {
            return res.status(400).json({
                success: false,
                error: userExists.email === email
                    ? "Email already registered"
                    : "Username already taken",
                statusCode: 400
            })
        }

        // Create user
        const user = await User.create({ username, email, password })

        // Generate token
        const token = generateToken(user._id)

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt
                },
                token,
            },
            message: "User registered successfully"
        })

    } catch (error) {
        next(error)
    }
}

// @desc Login a user
// @route POST /api/auth/login
// @access public

export const login = async(req, res, next) => {
    try {
        const {email, password} = req.body;

        //validate input
        if(!email || !password){
            return res.status(400).json({
                success: false,
                error: "Please provide valid email and password",
                statusCode:400,
            })
        }

        //Check for user(include password for comparision)
        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(401).json({
                success: false,
                error: "Invalid Credentials",
                statusCode: 401
            })
        }

        // Check password
        const isMatch = await user.matchPassword(password)

        if(!isMatch){
            return res.status(401).json({
                success: false,
                error: "Invalid Credentials",
                statusCode: 401
            })
        }

        // Generate Token
        const token = generateToken(user._id)

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
            token,
            message: "Login Successfully"
        })


    } catch (error) {
        next(error)
    }
}

// @desc Get User profile
// @route GET /api/auth/profile
// @access rivate

export const getProfile = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id)

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        })
    } catch (error) {
        next(error)
    }
}

// @desc Update user profile
// @route PUT /api/auth/profile
// @access private

export const updateProfile = async(req, res, next) => {
    try {
        const {username, email, profileImage } = req.body;

        const user = await User.findById(req.user._id)

        if(username) user.username = username;
        if(email) user.email = email;
        if(profileImage) user.profile = profileImage;

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
            message: "Profile updated successfully"
        })

    } catch (error) {
        next(error)
    }
}

// @desc Change password
// @route POST /api/auth/change-profile
// @access public

export const changePassword = async(req, res, next) => {
    try {
        const {currentPassword, newPassword} = req.body;

        if(!currentPassword || !newPassword){
            return res.status(400).json({
                success: false,
                error: "Please provide current and new password",
                statusCode: 400
            })
        }

        const user = await User.findById(req.user._id).select("+password")

        // Check current password
        const isMatch = await user.matchPassword(currentPassword)

        if(!isMatch){
            return res.status(401).json({
                success: false,
                error: "Current password is incorrect",
                statusCode: 401
            })
        }

        // Update Password

        user.password = newPassword
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error) {
        next(error)
    }
}