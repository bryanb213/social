const express = require('express');

const app = express.Router();

//@GET api/profile
app.get('/', (req, res) => {
    res.send('profile')
})

module.exports = app;