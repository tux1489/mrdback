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
    type: {
        type: String,
        enum: ['Gold Detail', 'Zaphire Detail', 'Emerald Detail', 'Ruby Detail', 'Diamond Detail']
    },
    status: {
        type: String,
        enum: ['pending', 'taken', 'completed', 'cancelled', 'discarded'],
        default: 'pending'
    }
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    })

module.exports = mongoose.model('Service', ServiceSchema);
