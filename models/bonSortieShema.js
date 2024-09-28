const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bonSortieSchema = new Schema(
    {
        reqId: {
            type: String,
        },
        employeeId: {
            type: String
        },
        employeeName: {
            type: String,
        },
        productId: {
            type: String
        },
        quantity: {
            type: Number
        },
        reason: {
            type: String
        }
    },
    {
        timestamps: true
    }
)


const BonSortie = mongoose.model('BonSortie', bonSortieSchema)
module.exports = BonSortie