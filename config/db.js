const mongoose = require('mongoose');
const DB_URI = require('../constants/constants');

const connectDB = async () => {
    try{
        // const connection = await mongoose.connect(DB_URI, {
        //     serverApi: {
        //         strict: true,
        //         deprecationErrors: true,
        //     }
        // });
        const connection = await mongoose.connect(DB_URI);
    }catch(error){
        console.log('Error in connecting database: ', error);
        throw error;
    };
    console.log('MongoDB database connected.');
};

module.exports = connectDB;