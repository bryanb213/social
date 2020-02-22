const mongoose = require('mongoose');
const config = require('config');
const db = "mongodb+srv://<blancasbryan>:<Chiquita1>@social-gsmvj.mongodb.net/test?retryWrites=true&w=majority"

const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('db connected')
    } catch (error) {
        console.log(error.message)
        //exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;