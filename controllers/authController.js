const USERS = require('../Models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 14;

// function for Login
const doLogin = async (req, res) => {
    const user = await USERS.findOne({userName: req.body.userName});
    if(user){
        bcrypt.compare(req.body.password, user.password, (error, hashRes) => {
            if(hashRes){
                const token = jwt.sign({userId: user._id, userName: user.userName, fullName: user?.fullName, role: user?.role}, "vacationcalendar", {expiresIn: '2d'});
                user.password = undefined;
                res.status(200).json({ message: 'login successful.', token: token, user: user });
            }
        })
    }else{
        res.status(200).json({ message: 'invalid credentials.', token: null })
    }
}

module.exports = { doLogin };