const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        tel: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        jobTitle: {
            type: String,
            required: true,
        },
        cin: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isStoreAdmin: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
        },
        status: {
            type: Boolean,
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)
module.exports = User