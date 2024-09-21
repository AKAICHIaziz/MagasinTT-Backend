const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tempUserSchema = new Schema(
    {
        email: {
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
        tel: {
            type: String,
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

const TempUser = mongoose.model('TempUser', tempUserSchema)
module.exports = TempUser