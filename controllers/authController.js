const User = require('../models/userSchema')
const TempUser = require('../models/tempUserSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const login = async (req, res) => {
    const { cin, password } = req.body
    try {
        const user = await User.findOne({ cin })
        if (!user) {
            return res.status(404).json({ message: "No user found" })
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            { id: user._id, cin: user.cin, jobTitle: user.jobTitle, username: user.username, isAdmin: user.isAdmin, isStoreAdmin: user.isStoreAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        )

        res.status(200).json({ message: 'Logged in successfully', token });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server Error" })
    }
}

const signup = async (req, res) => {
    const { email, username, jobTitle, tel, cin, password } = req.body
    try {
        const existingUser = await TempUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const existingUsername = await TempUser.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username is already taken." });
        }

        if (!cin || cin.length !== 8) {
            return res.status(400).json({ message: "Invalid CIN number." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const tempUser = new TempUser({ email, username, jobTitle, tel, cin, password: hashedPassword });
        await tempUser.save();

        if (tempUser) {
            res.status(201).json({ message: "Signed up successfully, wait for the admin to approve your request", user: tempUser });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
}


module.exports = {
    login,
    signup
}