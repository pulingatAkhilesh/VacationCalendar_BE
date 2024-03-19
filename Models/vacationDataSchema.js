const mongoose = require("mongoose");

const vacationDataSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    months: [{
        month: {
            type: Number,
            required: true
        },
        dates: [{
            date: {
                type: Number,
                required: true
            },
        }]
    }]
});

const VACATIONDATA = mongoose.model('vacationData', vacationDataSchema);
module.exports = VACATIONDATA;