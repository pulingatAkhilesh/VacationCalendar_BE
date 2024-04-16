const mongoose = require("mongoose");

const vacationDataSchema = mongoose.Schema({
    user_uId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    year: {
        type: Number,
    },
    date: {
        type: Date,
    },
});

const VACATIONDATA = mongoose.model('vacationData', vacationDataSchema, 'vacationData');
module.exports = VACATIONDATA;