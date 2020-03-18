const express = require('express');
const cors = require('cors')
const path = require('path')
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

const app = express()

const PORT = process.env.PORT || 5000;
app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys_dev').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

//init middleware
app.use(express.json({ extended: false }))

//Define routes
app.use('/api/users', users);
app.use('/api/profile', profile);

//serve
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}



app.listen(PORT, () => console.log(`Server started on ${PORT}`));