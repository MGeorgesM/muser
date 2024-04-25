const mongoose = require('mongoose');

const venueRatingSchema = new mongoose.Schema({
    musicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
});

const VenueRating = mongoose.model('VenueRating', venueRatingSchema);
module.exports = { VenueRating, venueRatingSchema };
