const USERS = require('../Models/userSchema');
const bcrypt = require('bcrypt');
const saltRounds = 14;
const jwt = require('jsonwebtoken');
const TEAM = require('../Models/teamSchema');

// function for Login.
const doLogin = async (req, res) => {
    const user = await USERS.findOne({ userID: req.body.userID });
    if (user) {
        bcrypt.compare(req.body.password, user.password, (error, hashRes) => {
            if (hashRes) {
                const sessionTime = Date.now();
                console.log('doLogin - sessionTime', sessionTime)
                console.log('user?.defaultRole: ', user?.defaultRole);
                const token = jwt.sign({ uId: user._id, sessionTime: sessionTime, email: user.email, fullName: user?.fullName, role: user?.defaultRole }, "vacationcalendar", { expiresIn: '2d' });
                console.log('doLogin - token: ', token)
                user.password = undefined;
                res.status(200).json({ message: 'login successful.', token: token, user: user, sessionTime: sessionTime });
            }
        })
    } else {
        res.status(200).json({ message: 'invalid credentials.', token: null })
    }
}

// function for registering administrator.
const createAdmin = async (req, res) => {
    const existingEmail = await USERS.findOne({ email: req.body.email });
    const existingUserID = await USERS.findOne({ userID: req.body.userID });
    if (existingEmail) {
        res.status(200).json({ message: 'Email already exist.' });
        return;
    };
    if (existingUserID) {
        res.status(200).json({ message: 'User ID already exist.' });
        return;
    };

    console.log(req.body);

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        console.log(hash);
        USERS({
            fullName: req.body.fullName,
            email: req.body.email,
            userID: req.body.userID,
            password: hash,
            defaultTeam: req.body.defaultTeam,
            defaultRole: req.body.defaultRole,
            joiningDate: req.body.joiningDate,
        }).save().then((response) => {
            res.status(200).json({ message: 'admin registration successful.' });
        });
    });
};

// function for registering new user.
const registerUser = async (req, res) => {
    const existingEmail = await USERS.findOne({ email: req.body.email });
    const existingUserID = await USERS.findOne({ userID: req.body.userID });
    if (existingEmail) {
        res.status(200).json({ message: 'email already exist.' });
        return;
    };
    if (existingUserID) {
        res.status(200).json({ message: 'User ID already exist.' });
        return;
    };

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Save the user to the database.
        const newUser = await USERS.create({
            fullName: req.body.fullName,
            email: req.body.email,
            userID: req.body.userID,
            password: hashedPassword,
            defaultTeam: req.body.defaultTeam,
            defaultRole: req.body.defaultRole,
            joiningDate: req.body.joiningDate,
        });

        // Update the team with the new user's userID.
        await TEAM.updateOne(
            { teamName: req.body.defaultTeam, 'roles.roleName': req.body.defaultRole },
            { $push: { 'roles.$.members': { userID: req.body.userID } } }
        );
        res.status(200).json({ message: 'New user registration successful.', newUser });
    } catch (error) {
        console.error('Error registering new user.');
        res.status(500).json({ message: 'Server error.' });
    };
};

// function to check JWT token of the logged in session.
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'You are not logged in.' });
    };

    jwt.verify(token, 'vacationcalendar', (err, decoded) => {
        if (err.message === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Login session expired. Login again.' });
        } else {
            return res.status(403).json({ message: 'Session not authonticated. Login again.' });
        };
    });
};

module.exports = { doLogin, createAdmin, registerUser, verifyToken };