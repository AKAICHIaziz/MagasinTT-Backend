const mongoose = require('mongoose')

const Schema = mongoose.Schema

const requestSchema = new Schema(
    {
        employeeId: {
            type: String,
        },
        employeeName: {
            type: String,
        },
        ProdNum: {
            type: String,
        },
        status: {
            type: String
        }
    },
    {
        timestamps: true
    }
)


const Request = mongoose.model('Request', requestSchema)
module.exports = Request