const express = require('express');

const { connect } = require('./configs/mongoDB.config.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/user.routes');

app.use('/users', userRoutes);

app.listen(port, (error) => {
    if (error) {
        console.error('Error starting server:', error);
    }
    console.log(`Server is running on port ${port}`);
    connect();
});
