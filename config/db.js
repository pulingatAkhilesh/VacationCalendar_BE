const mongoose = require('mongoose');
const mongoURI = String(process.env.MONGO_URI);

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            // No need for useNewUrlParser and useUnifiedTopology.
        });
        console.log('MongoDB database connected.');
    } catch (error) {
        console.log('Error in connecting database: ', error.message);
        process.exit(1);
    };
};

module.exports = connectDB;