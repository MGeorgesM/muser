const mongoose = require('mongoose');

const musicianProfileSchema = new mongoose.Schema({
    experience: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    availability: { type: String, enum: ['Morning', 'Afternoon', 'Evening'] },
    genre: {
        type: String,
        enum: [
            'Rock',
            'Pop',
            'Jazz',
            'Blues',
            'Metal',
            'Folk',
            'Country',
            'Classical',
            'Electronic',
            'Hip-Hop',
            'Rap',
            'Reggae',
            'R&B',
            'Soul',
            'Punk',
            'Indie',
            'Other',
        ],
    },
    instrument: { type: String, enum: ['Guitar', 'Bass', 'Drums', 'Vocals', 'Keyboard', 'Strings', 'Other'] },
});

const venueProfileSchema = new mongoose.Schema({
    venueType: { type: String, enum: ['Bar', 'Club', 'Restaurant', 'Cafe', 'Hotel', 'Other'] },
});

const userSchema = new mongoose.Schema({
    firebaseUserId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        index: true,
        enum: ['musician', 'venue'],
    },
    about: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        enum: ['North', 'South', 'Beirut', 'Mount Lebanon', 'Bekaa', 'Baalbek-Hermel', 'Other'],
    },
    profilePicture: {
        type: String,
        required: false,
    },
    venueProfile: venueProfileSchema,
    musicianProfile: musicianProfileSchema,
});

const User = mongoose.model('User', userSchema);
module.exports = { User, userSchema };
