const express = require('express');

const { connect } = require('./configs/mongoDB.config');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routes/auth.routes');

app.use('/auth', authRouter);

app.listen(port, (error) => {
    if (error) {
        console.error('Error starting server:', error);
    }
    console.log(`Server is running on port ${port}`);
    connect();
});
