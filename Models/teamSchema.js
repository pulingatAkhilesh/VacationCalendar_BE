const mongoose = require("mongoose");
const teamRoles = require('../constants/roles');

// Define teamSchema
const teamSchema = mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true,
    },
    teamRoles: [{
        type: String,
        enum: teamRoles,
        required: true,
    }],
    users: [
        {
            roleName: {
                type: String,
                required: true,
                enum: teamRoles,
                validate: {
                    validator: function(value){
                        // Check if the roleName is "administrator" only for the "dba" team.
                        return !(this.teamName === "dba" && value !== "administrator");
                    },
                    message: 'Invalid role for the Team.',
                },
            },
            userID: {
                type: String,
                required: true,
            },
            user_uId: {
                type: mongoose.Types.ObjectId,
            },
            userAddedOn: {
                type: Date,
                default: new Date(),
            },
        },
    ],
});

const TEAM = mongoose.model('Team', teamSchema);
module.exports = TEAM;