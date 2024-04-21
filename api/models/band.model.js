const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    datetime: {
        type: Date,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
});

const bookingSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Accepted', 'Rejected'],
    },
    show: showSchema,
});

const bandSchema = new mongoose.Schema({
    bandMembers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    bookings: { type: [bookingSchema], default: [] },
});

const Band = mongoose.model('Band', bandSchema);
module.exports = { Band, bandSchema };
