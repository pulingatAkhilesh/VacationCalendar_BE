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
        console.log('========================================');
        console.log('getUserFullName - req: ', req);
        console.log('getUserFullName - req.params: ', req.params);
        const user = await USERS.findOne({ userID: userID }).select('fullName');
        console.log('getUserFullName - user: ', user);
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
    const { userID, year, month, selectedDates } = req.body;
    console.log('req.body: ', req.body);
    try{
        // Check if the document already exists for the given year and month.
        let vacationData = await VACATIONDATA.findOne({ userID, year });
        if(!vacationData){
            vacationData = new VACATIONDATA({
                userID,
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

        // const dateObjects = selectedDates.map(day => new Date(year, month, day));

        // Add the selected dates to the month.
        // monthData.dates = selectedDates;
        // monthData.dates = [...new Set([...monthData.dates, ...selectedDates])];
        monthData.dates.push(...selectedDates);
        // monthData.dates.push(...dateObjects);
        console.log('vacationData: ', vacationData);
        console.log('monthData: ', monthData);
        console.log('selectedDates: ', selectedDates);

        // save the selected dates to the month.
        await vacationData.save();

        res.status(200).json({ success: true, message: 'Vacation Plan successfully saved.' });
    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

module.exports = { getAllUsers, getUserFullName, createVacation };