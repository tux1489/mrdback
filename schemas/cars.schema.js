const mongoose = require('mongoose')
const Schema = mongoose.Schema

let CarSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    model: String,
    serial: String,
    color: String
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    })

module.exports = mongoose.model('Car', CarSchema);
