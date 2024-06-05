const mongoose = require('mongoose');
const DB_URI = require('../constants/constants');

const connectDB = async () => {
    try{
    }catch(error){
        console.log('Error in connecting database: ', error);
        throw error;
    };
    console.log('MongoDB database connected.');
};

module.exports = connectDB;