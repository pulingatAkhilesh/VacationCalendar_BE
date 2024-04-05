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

// Get fullName of the given userID.
const getUserFullName = async (req, res) => {
    try{
        const { userID } = req.params;
        const user = await USERS.findOne({ userID: userID }).select('fullName');
        if(!user){
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ fullName: user.fullName });
    }catch(error){
        console.error('Error fetching user full name: ', error);
        res.status(500).json({ message: 'Server error.' });
    };
};

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

const getUserVacationData = async (req, res) => {
    const { uId } = req.body;
    const userVacationData = await VACATIONDATA.find({ uId: uId });
    console.log('userVacationData: ', userVacationData)
}

module.exports = { getAllUsers, getUserFullName, createVacation, getUserVacationData };