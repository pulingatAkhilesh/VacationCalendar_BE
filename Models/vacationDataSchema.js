const mongoose = require("mongoose");

const vacationDataSchema = mongoose.Schema({
    uId: {
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

const VACATIONDATA = mongoose.model('vacationData', vacationDataSchema, 'vacationData');
module.exports = VACATIONDATA;