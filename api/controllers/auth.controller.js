const admin = require('../configs/firebaseAdmin.config');
const { User } = require('../models/user.model');

const register = async (req, res) => {
    const {
        name,
        email,
        password,
        userType,
        about,
        venueType,
        location,
        instrument,
        genre,
        experience,
        availability,
        profilePicture,
    } = req.body;

    try {
        const firebaseUser = await admin.auth().createUser({
            email,
            password,
        });

        const newUser = new User({
            firebaseUserId: firebaseUser.uid,
            email,
            name,
            userType,
            about,
            location,
            profilePicture,
        });

        if (userType === 'musician') {
            newUser.musicianProfile = {
                instrument,
                genre,
                experience,
                availability,
            };
        } else if (userType === 'venue') {
            newUser.venueProfile = {
                venueType,
            };
        }

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
        console.log('Registration error:', error);
        if (error.code === 'auth/email-already-exists') {
            res.status(400).json({ error: 'Email already in use.' });
        } else {
            res.status(500).json({ error: 'Failed to register user.', error });
        }
    }
};

module.exports = { register };
