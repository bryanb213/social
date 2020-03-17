const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
const path = require('path')
const passport = require('passport');

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
//conect DB
connectDB();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//init middleware
app.use(express.json({ extended: false }))

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

//serve
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}



app.listen(PORT, () => console.log(`Server started on ${PORT}`));