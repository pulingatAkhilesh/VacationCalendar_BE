const USERS = require('../Models/userSchema');
const bcrypt = require('bcrypt');
const saltRounds = 14;
const jwt = require('jsonwebtoken');

// function for Login.
const doLogin = async (req, res) => {
    const user = await USERS.findOne({ username: req.body.username });
    if(user){
        bcrypt.compare(req.body.password, user.password, (error, hashRes) => {
            if(hashRes){
                const token = jwt.sign({userId: user._id, username: user.username, fullName: user?.fullName, role: user?.role}, "vacationcalendar", {expiresIn: '2d'});
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
    const existingUsername = await USERS.findOne({ username: req.body.username});
    if(existingEmail){
        res.status(200).json({ message: 'email already exist.' });
        return;
    };
    if(existingUsername){
        res.status(200).json({ message: 'username already exist.' });
        return;
    };

    console.log(req.body);

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        console.log(hash);
        USERS({
            fullName: req.body.fullName,
            email: req.body.email,
            username: req.body.username,
            password: hash
        }).save().then((response) => {
            res.status(200).json({ message: 'admin registration successful.' });
        });
    });
}

module.exports = { doLogin, createAdmin };