const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const connection = await mongoose.connect('mongodb://127.0.0.1:27017/vacationcalendar', {});
        console.log('MongoDB database connected.');
    }catch(error){
        console.log('Error in connecting database: ', error);
        throw error;
    };
};

module.exports = connectDB;