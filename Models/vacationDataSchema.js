const { default: mongoose } = require("mongoose");

const vacationDataSchema = mongoose.Schema({
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "userId": {
            "type": "string"
        },
        "year": {
        "type": "integer"
        },
        "months": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "month": {
                        "type": "string"
                    },
                    "dates": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "format": "date"  // Assuming dates are in ISO format (YYYY-MM-DD)
                        }
                    }
                },
                "required": ["month", "dates"]
            }
        }
    },
    "required": ["userId", "year", "months"]
})

const vacationData = mongoose.model('vacationData', vacationDataSchema);
module.exports = vacationData;