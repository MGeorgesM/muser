const express = require('express');
const router = express.Router();
const admin = require('../configs/firebaseAdmin.config');

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.auth().createUser({
            email,
            password,
        });
        res.json(user);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.auth().getUserByEmail(email);
        const token = await admin.auth().createCustomToken(user.uid);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json(error.message);
    }
});


module.exports = router;
