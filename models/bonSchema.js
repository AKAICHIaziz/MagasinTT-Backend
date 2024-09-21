const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bonSchema = new Schema(
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


const Bon = mongoose.model('Bon', bonSchema)
module.exports = Bon