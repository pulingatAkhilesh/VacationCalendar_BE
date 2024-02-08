const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    defaultTeam: {
        type: String,
        required: true,
    },
    defaultRole: {
        type: String,
        required: true,
    },
    joiningDate: {
        type: Date,
        required: true,
    }
});

const users = mongoose.model('users', userSchema);
module.exports = users;