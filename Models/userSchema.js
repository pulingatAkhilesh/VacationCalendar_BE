const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    eMail: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const users = mongoose.model('users', userSchema);
module.exports = users;