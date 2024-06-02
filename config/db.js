const mongoose = require('mongoose');
const DB_URI = require('../constants/constants');

const connectDB = async () => {
    try{
        const connection = await mongoose.connect(DB_URI, {
            serverApi: {
                strict: true,
                deprecationErrors: true,
            }
        });
        console.log('MongoDB database connected.');
    }catch(error){
        console.log('Error in connecting database: ', error);
        throw error;
    };
};

module.exports = connectDB;