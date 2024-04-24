const mongoose = require("mongoose");

const vacationDataSchema = mongoose.Schema({
    user_uId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    year: {
        type: String,
    },
    selected_dates: [{
        type: Date,
        required: true,
    }],
});

const VACATIONDATA = mongoose.model('vacationData', vacationDataSchema, 'vacationData');
module.exports = VACATIONDATA;