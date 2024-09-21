const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema(
    {
        category: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true,
        },
        ref: {
            type: String,
            required: true,
            unique: true
        },
        quantity: {
            type: Number,
            default: 0
        },
        qte: {
            type: String
        },
        provider: {
            type: String,
        },
        maker: {
            type: String,
        },
        bon: {
            type: String,
        },
        image: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema)
module.exports = Product