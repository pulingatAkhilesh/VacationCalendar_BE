const { default: mongoose } = require("mongoose");

const vacationDataSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
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
                    type: [ String ],
                    required: true
                }
            }
        ],
        required: true
    }
});

const VACATIONDATA = mongoose.model('vacationData', vacationDataSchema);
module.exports = VACATIONDATA;