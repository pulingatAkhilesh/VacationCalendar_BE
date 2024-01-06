const { default: mongoose } = require("mongoose");

const vacationDataSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    months: {
        type: [
            {
                month: {
                    type: String,
                    required: true
                },
                dates: {
                    type: [ Date ],
                    required: true
                }
            }
        ],
        required: true
    }
});

const vacationData = mongoose.model('vacationData', vacationDataSchema);
module.exports = vacationData;