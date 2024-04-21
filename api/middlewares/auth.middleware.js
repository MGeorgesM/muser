const admin = require('../configs/firebaseAdmin.config.js');

const authMiddleware = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) return res.status(401).json({ message: 'Unauthorized. Please Sign In.' });

            const decodedToken = await admin.auth().verifyIdToken(token);
            if (!decodedToken) return res.status(401).json({ message: 'Unauthorized. Invalid Token.' });

            const user = await admin.auth().getUser(decodedToken.uid);
            if (!user) return res.status(401).json({ message: 'Unauthorized. User not found.' });

            req.user = decodedToken;
            return next();
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error while Authenticating', error });
    }
};

module.exports = authMiddleware;
