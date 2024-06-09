const mongoose = require('mongoose');
const mongoURI = String(process.env.MONGO_URI);

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongoURI, {
        // const connection = await mongoose.connect('mongodb+srv://akhilesh0428:NQkPYRYED61g3EX8@vacationcalendar00.loon9k9.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (error) {
        console.log('Error in connecting database: ', error);
        throw error;
    };
    console.log('MongoDB database connected.');
};

module.exports = connectDB;