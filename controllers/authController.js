const USERS = require('../Models/userSchema');
const bcrypt = require('bcrypt');
const saltRounds = 14;
const jwt = require('jsonwebtoken');

// function for Login.
const doLogin = async (req, res) => {
    const user = await USERS.findOne({ userID: req.body.userID });
    if(user){
        bcrypt.compare(req.body.password, user.password, (error, hashRes) => {
            if(hashRes){
                const token = jwt.sign({userID: user._id, email: user.email, fullName: user?.fullName, role: user?.defaultRole}, "vacationcalendar", {expiresIn: '2d'});
                console.log('doLogin - token: ', token)
                user.password = undefined;
                res.status(200).json({ message: 'login successful.', token: token, user: user });
            }
        })
    }else{
        res.status(200).json({ message: 'invalid credentials.', token: null })
    }
}

// function for registering administrator.
const createAdmin = async (req, res) => {
    const existingEmail = await USERS.findOne({ email: req.body.email });
    const existingUserID = await USERS.findOne({ userID: req.body.userID});
    if(existingEmail){
        res.status(200).json({ message: 'Email already exist.' });
        return;
    };
    if(existingUserID){
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
    if(existingEmail){
        res.status(200).json({ message: 'email already exist.' });
        return;
    };
    if(existingUserID){
        res.status(200).json({ message: 'User ID already exist.' });
        return;
    };

    console.log('input data req.body: ', req.body);

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        console.log('hash: ', hash);
        USERS({
            fullName: req.body.fullName,
            email: req.body.email,
            userID: req.body.userID,
            password: hash,
            defaultTeam: req.body.defaultTeam,
            defaultRole: req.body.defaultRole,
            joiningDate: req.body.joiningDate,
        }).save().then((response) => {
            res.status(200).json({ message: 'New user registration successful.' });
        });
    });
};

module.exports = { doLogin, createAdmin, registerUser };