
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RequestedProductsSchema = new Schema(
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
        status: {
            type: String
        },
        reason: {
            type: String
        }
    },
    {
        timestamps: true
    }
)


const RequestedProducts = mongoose.model('RequestedProducts', RequestedProductsSchema)
module.exports = RequestedProducts