const jwt = require('jsonwebtoken');

// Authorization for Role: TeamMember
const userAuth = (req, res, next) => {
    try{
        const token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token, 'vacationcalendar', (error, decodedToken) => {
            if(decodedToken){
                req.userId = decodedToken.userID;
                next();
            }else{
                console.log(error);
                res.status(401).json({ message: 'unauthorized user.' });
            };
        });
    }catch(error){
        console.log(error);
        res.status(401).json({ error: error.message });
    };
};

// Authorization for Role: TeamMember
const teamMemberAuth = (req, res, next) => {
    try{
        const token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token, 'vacationcalendar', (error, decodedToken) => {
            if(decodedToken && decodedToken.role === 'TeamMember'){
                req.userId = decodedToken.userID;
                next();
            }else{
                console.log(error);
                res.status(401).json({ message: 'unauthorized user.' });
            };
        });
    }catch(error){
        console.log(error);
        res.status(401).json({ error: error.message });
    };
};

// Authorization for Role: TeamLead
const teamLeadAuth = (req, res, next) => {
    try{
        const token = req.headers['authorization'].split(' ')[1];
        console.log('teamLeadAuth - token: ', token);
        jwt.verify(token, 'vacationcalendar', (error, decodedToken) => {
            if(decodedToken && decodedToken.role === 'TeamLead'){
                req.userId = decodedToken.userID;
                next();
            }else{
                console.log(error);
                res.status(401).json({ message: 'unauthorized user.' });
            }
        });
    }catch(error){
        console.log(error);
        res.status(401).json({ error: error.message });
    };
};

// Authorization for Role: administrator
const adminAuth = (req, res, next) => {
    console.log('adminAuth - req: ', req.headers);
    try{
        const token = req.headers['authorization'].split(' ')[1];
        console.log('adminAuth - token: ', token);
        jwt.verify(token, 'vacationcalendar', (error, decodedToken) => {
            console.log('decodedToken: ', decodedToken);
            console.log('decodedToken - role: ', decodedToken.role);
            if(decodedToken && decodedToken.role === 'administrator'){
                req.userId = decodedToken.userID;
                next();
            }else{
                console.log(error);
                res.status(401).json({ message: 'unauthorized user.' });
            }
        });
    }catch(error){
        console.log(error);
        res.status(401).json({ error: error.message });
    };
};

module.exports = { userAuth, teamMemberAuth, teamLeadAuth, adminAuth };