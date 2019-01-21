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
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car'
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
    appointment: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'appointed', 'taken', 'completed', 'cancelled', 'discarded'],
        default: 'pending'
    }
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    })

module.exports = mongoose.model('Service', ServiceSchema);
