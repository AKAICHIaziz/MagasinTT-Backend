const bcrypt = require('bcrypt')
const User = require('../models/userSchema')
const TempUser = require('../models/tempUserSchema')

const getUsers = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const users = await User.find()
        res.status(200).json({ users: users })
    } catch (error) {
        res.status(401).json({ message: 'Server error', message: error.message })
    }
}

const getUsernameAndJob = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username }); // Assuming req.user is set by the token verification middleware
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ test: true, username: user.username, jobTitle: user.jobTitle, isAdmin: user.isAdmin, isStoreAdmin: user.isStoreAdmin });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUser = async (req, res) => {
    // if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: id })
        res.status(200).json({ user: user })
    } catch (error) {
        res.status(401).json({ Error: 'Server error', message: error.message })
    }
}

const getTempUsers = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const tempUsers = await TempUser.find()
        res.status(200).json({ tempUsers: tempUsers })
    } catch (error) {
        res.status(401).json({ message: 'Server error', message: error.message })
    }
}

const getTempUser = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { id } = req.params
        const tempUser = await TempUser.findOne({ _id: id })
        res.status(200).json({tempUser: tempUser})
    } catch (error) {
        res.status(401).json({ Error: 'Server error', message: error.message })
    }
}

const approveTempUser = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { id } = req.params
        const tempUser = await TempUser.findOne({ _id: id })
        if (!tempUser) return res.status(404).json({ message: "User does not exist" })
        const newUser = new User({ email: tempUser.email, username: tempUser.username, jobTitle: tempUser.jobTitle, tel: tempUser.tel, cin: tempUser.cin, password: tempUser.password })
        await newUser.save()
        if (!newUser) return res.status(403).json({ message: "Error while approving the user" })
        const tempUserDeleted = await TempUser.findOneAndDelete({ username: newUser.username })
        if (!tempUserDeleted) return res.status(403).json({ message: "Error while removing user from the temp db" })
        res.status(201).json({ message: "User approved successfully!", new_user: newUser })
    } catch (error) {
        res.status(500).json({ message: 'Server error', message: error.message })
    }
}

const addUser = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { email, username, jobTitle, cin, password } = req.body
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ email, username, jobTitle, cin, password: hashedPassword })
        await user.save()
        if (user) {
            res.status(201).json({ message: "User added successfully!", user: user })
        }
    }
    catch (error) {
        res.status(403).json({ message: "Some of the informations you entred are already in use, try again." })
    }
}

const deleteUser = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(200).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { id } = req.params
        const user = await User.findOneAndDelete({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', message: error.message })
    }
}

const deleteTempUser = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(200).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { id } = req.params
        const user = await TempUser.findOneAndDelete({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', message: error.message })
    }
}

const patchUser = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(200).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { id } = req.params
        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true, runValidators: true }
        )
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

module.exports = {
    getUsernameAndJob,
    getUsers,
    getUser,
    getTempUsers,
    getTempUser,
    approveTempUser,
    addUser,
    deleteUser,
    deleteTempUser,
    patchUser
}