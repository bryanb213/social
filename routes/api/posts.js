const express = require('express');

const app = express.Router();

//@GET api/post
app.get('/', (req, res) => {
    res.send('post')
})

module.exports = app;