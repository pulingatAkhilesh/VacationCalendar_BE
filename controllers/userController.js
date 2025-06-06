const { default: mongoose } = require('mongoose');
const USERS = require('../Models/userSchema');
const VACATIONDATA = require('../Models/vacationDataSchema');
const TEAM = require('../Models/teamSchema');
const OBJECT_ID = mongoose.Types.ObjectId;

// GET all Teams.
const getAllUsers = async (req, res) => {
    try {
        const usersList = await USERS.find();
        res.status(200).json(usersList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};

// GET fullName of the given userID.
const getUserFullName = async (req, res) => {
    try {
        const { user_uId } = req.params;
        const user = await USERS.findById(user_uId).select('fullName');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        };
        res.status(200).json({ fullName: user.fullName });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    };
};

// Fetch teams to which the logged in user is added. 
const getUserTeams = async(req, res) => {
    const { user_uId } = req.params;

    try {
        const userTeams = await TEAM.find({ 'users.user_uId': user_uId });
        res.status(200).json(userTeams);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    };
};

// Store vacation planned dates of a user in the database.
const createVacation = async (req, res) => {
    try {
        const { uId, year, selectedDates } = req.body;

        if (!uId || !year || !selectedDates || !Array.isArray(selectedDates)) {
            return res.status(400).json({ success: false, message: 'Invalid request data.' });
        };
        if (selectedDates.length == 0) {
            return res.status(400).json({ success: false, message: 'No dates selected. Please select dates and try again to save vacation plan.' });
        };

        // Check if data for the given year already exists.
        let existingData = await VACATIONDATA.findOne({ user_uId: uId, year: year });
        if (existingData) {
            // Data for the given year exists, check for the duplicate dates.
            const existingDateStrings = existingData.selected_dates.map(date => date.toISOString().split('T')[0]);
            const duplicateDates = selectedDates.filter(date => existingDateStrings.includes(date));
            if (duplicateDates.length === selectedDates.length) {
                // All selected dates are duplicates.
                return res.status(200).json({ success: false, message: 'All selected dates already exist in the database.' });
            };

            // Some selected dates are duplicates.
            // Filter out the dates that are not duplicates.
            const newDates = selectedDates.filter(date => !existingDateStrings.includes(date));
            if (newDates.length > 0) {
                // Update the existing data by adding new dates.
                await VACATIONDATA.updateOne(
                    { user_uId: uId, year: year },
                    { $push: { selected_dates: { $each: newDates } } }
                );
                if (duplicateDates.length > 0) {
                    return res.status(200).json({ success: true, message: 'Vacation Plan successfully saved. Duplicate date(s) skipped.' });
                } else {
                    return res.status(200).json({ success: true, message: 'Vacation Plan successfully saved.' });
                };
            } else {
                return res.status(400).json({ success: false, message: 'No new dates to add. Duplicate date(s) skipped.' });
            };
        } else {
            // No data for the given year or no duplicate dates found. Create new data.
            const vacationData = new VACATIONDATA({ user_uId: uId, year: year, selected_dates: selectedDates });
            await vacationData.save();

            return res.status(200).json({ success: true, message: 'Vacation Plan successfully saved.' });
        };
    } catch (error) {
        console.error('Error creating user vacation: ', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    };
};

// GET planned vacation dates of a user.
const getUserVacationData = async (req, res) => {
    try {
        const { user_uId } = req.params;
        const userVacationData = await VACATIONDATA.aggregate([
            {
                $match: { user_uId: new OBJECT_ID(user_uId) }
            },
            {
                $unwind: '$selected_dates'
            },
            {
                $addFields: {
                    month: { $month: '$selected_dates' },
                    yearSelected: { $year: '$selected_dates' },
                }
            },
            {
                $match: {
                    month: parseInt(req.query.month),
                    yearSelected: { $eq: parseInt(req.query.year) },
                    selected_dates: {
                        $gte: new Date(parseInt(req.query.year), parseInt(req.query.month) - 1, 1),
                        $lt: new Date(parseInt(req.query.year), parseInt(req.query.month), 1),
                    }
                }
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'user_uId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    user: { $arrayElemAt: ['$user', 0] },
                    selected_dates: 1,
                    month: 1,
                    user_uId: 1,
                    _id: 1
                }
            },
            {
                $group: { _id: '$user_uId', data: { $push: '$$ROOT' } }
            }
        ]);

        res.status(200).json({ data: userVacationData });
    } catch (error) {
        console.error('Error retrieving user vacation data: ', error);
        res.status(500).json({ message: 'Internal server error.' });
    };
};

const deleteVacationDate = async (req, res) => {
    const { user_uId } = req.params;
    const { date } = req.query;
    // console.log('=========================req=========================: ', req)

    if(!date){
        return res.status(400).json({message: 'Date is required.'});
    };

    try {
        console.log('=========================date=========================: ', date)
        const vacationData = await VACATIONDATA.findById(user_uId);
        console.log('=========================vacationData=========================: ', vacationData)

        if(!vacationData){
            return res.status(404).json({ message: 'Vacation data not found' });
        };

        // Filter out the date from the selected_dates array
        vacationData.selected_dates = vacationData.selected_dates.filter(
            (d) => d.toISOString() !== new Date(date).toISOString()
        );
    
        await vacationData.save();
        res.status(200).json({ message: 'Date deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error.'});
    };
};

module.exports = { getAllUsers, getUserFullName, getUserTeams, createVacation, getUserVacationData, deleteVacationDate };