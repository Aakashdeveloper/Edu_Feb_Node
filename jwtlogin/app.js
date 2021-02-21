const express = require('express');
const app = express();
const db  = require('./db');
const port = 5000;

const AuthController = require('./controller/authController');
app.use('/api/auth',AuthController);

app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})