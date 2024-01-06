const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        const connection = await mongoose.connect('mongodb://localhost:27017/vacationcalendar', {
            useNewUrlParser: 'true',
            useUnifiedTopology: 'true',
        });
        console.log('MongoDB database connected.');
    }catch(error){
        console.log(error)
    };
};

module.exports = connectDB;