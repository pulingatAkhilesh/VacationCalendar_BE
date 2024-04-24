const USERS = require('../Models/userSchema');
const VACATIONDATA = require('../Models/vacationDataSchema');

// GET all Teams.
const getAllUsers = async (req, res) => {
    try{
        const usersList = await USERS.find();
        res.status(200).json(usersList);
    }catch(error){
        res.status(500).json({ error: error.message });
    };
};

// GET fullName of the given userID.
const getUserFullName = async (req, res) => {
    try{
        const { user_uId } = req.params;
        const user = await USERS.findById(user_uId).select('fullName');
        console.log('getUserFullName - user: ', user)
        if(!user){
            return res.status(404).json({ message: 'User not found.' });
        };
        res.status(200).json({ fullName: user.fullName });
    }catch(error){
        res.status(500).json({ message: 'Server error.' });
    };
};

// Store vacation planned dates of a user in the database.
const createVacation = async (req, res) => {
    try{
        const { uId, year, selectedDates } = req.body;

        if (!uId || !year || !selectedDates || !Array.isArray(selectedDates)) {
            return res.status(400).json({ success: false, message: 'Invalid request data.' });
        };

        // Check if data for the given year already exists.
        let existingData = await VACATIONDATA.findOne({ user_uId: uId, year: year });
        if (existingData) {
            // Data for the given year exists, check for the duplicate dates.
            const duplicateDates = selectedDates.filter(date => existingData.selected_dates.includes(date));
            if (duplicateDates.length === selectedDates.length) {
                // All selected dates are duplicates.
                return res.status(400).json({ success: false, message: 'All selected dates already exist in the database.' });
            };
            if (duplicateDates.length > 0) {
                // Some selected dates are duplicates.
                // Filter out the dates that are not duplicates.
                const newDates = selectedDates.filter(date => !existingData.selected_dates.includes(date));

                // Update the existing data by adding new dates.
                existingData.selected_dates = [...existingData.selected_dates, ...newDates];
                await existingData.save();

                return res.status(200).json({ success: true, message: 'Vacation Plan successfully saved. Duplicate date(s) skipped.' });
            };
        };

        // No data for the given year or no duplicate dates found. Create new data.
        const vacationData = new VACATIONDATA({ user_uId: uId, year: year, selected_dates: selectedDates });
        await vacationData.save();

        res.status(200).json({ success: true, message: 'Vacation Plan successfully saved.' });
    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    };
};

// GET planned vacation dates of a user.
const getUserVacationData = async (req, res) => {
    // const { uId } = req.params;
    // console.log('userVacationData - req.params: ', req.params)
    // const userVacationData = await VACATIONDATA.find({ uId: uId });
    // console.log('userVacationData: ', userVacationData)
    // res.status(200).json(userVacationData)
}

module.exports = { getAllUsers, getUserFullName, createVacation, getUserVacationData };