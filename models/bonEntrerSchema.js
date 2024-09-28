const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bonEntrerSchema = new Schema(
    {
        NumBon: {
            type: String,
        },
        NumProd: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)


const BonEntrer = mongoose.model('BonEntrer', bonEntrerSchema)
module.exports = BonEntrer