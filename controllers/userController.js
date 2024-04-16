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
    const { uId, year, month, selectedDates } = req.body;
    try{
        // Check if the document already exists for the given year and month.
        let vacationData = await VACATIONDATA.findOne({ uId, year });
        if(!vacationData){
            vacationData = new VACATIONDATA({
                uId,
                year,
                months: [],
            });
        };

        // Find or create the month object.
        let monthData = vacationData.months.find((m) => m.month === month);
        if(!monthData){
            monthData = {
                month,
                dates: [],
            };
            vacationData.months.push(monthData);
        };

        // Add the selected dates to the month.
        selectedDates.forEach(date => {
            const dateExists = monthData.dates.some(existingDate => existingDate.date === date);
            if(!dateExists){
                monthData.dates.push({ date });
            };
        });

        // Save the selected dates to the month.
        await vacationData.save();

        res.status(200).json({ success: true, message: 'Vacation Plan successfully saved.' });
    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

// GET planned vacation dates of a user.
const getUserVacationData = async (req, res) => {
    const { uId } = req.params;
    console.log('userVacationData - req.params: ', req.params)
    const userVacationData = await VACATIONDATA.find({ uId: uId });
    console.log('userVacationData: ', userVacationData)
    res.status(200).json(userVacationData)
}

module.exports = { getAllUsers, getUserFullName, createVacation, getUserVacationData };