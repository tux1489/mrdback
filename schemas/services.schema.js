const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ServiceSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    take_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: Date,
    loc: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number]
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'discarded']
    }
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    })

module.exports = mongoose.model('Service', ServiceSchema);
