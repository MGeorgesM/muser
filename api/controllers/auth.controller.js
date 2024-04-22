const admin = require('../configs/firebaseAdmin.config');
const { User } = require('../models/user.model');

const register = async (req, res) => {
    const { email, password, name, userType, location, biography, profilePicture } = req.body;

    // if (!email || !password || !fullName || !userType || !location) {
    //     return res.status(400).json({ error: 'All fields are required.' });
    // }

    try {
        const firebaseUser = await admin.auth().createUser({
            email,
            password,
        });

        const newUser = new User({
            firebaseUserId: firebaseUser.uid,
            email,
            name,
            userType: 'musician',
            // location,
            // biography,
            // profilePicture,
        });

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
        console.log('Registration error:', error);
        if (error.code === 'auth/email-already-in-use') {
            res.status(400).json({ error: 'Email already in use.' });
        } else {
            res.status(500).json({ error: 'Failed to register user.' });
        }
    }
};

module.exports = { register };
