const mongoose = require('mongoose');

const connect =  () => {
    mongoose.connect(process.env.MONGODB_URI);

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (error) => {
        console.log('MongoDB connection error', error);
    }); 
};

module.exports = { connect };
