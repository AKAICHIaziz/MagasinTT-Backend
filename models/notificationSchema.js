const mongoose = require('mongoose')

const Schema = mongoose.Schema

const notificationSchema = new Schema(
    {
        userId: {
            type: String,
        },
        content: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)


const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification