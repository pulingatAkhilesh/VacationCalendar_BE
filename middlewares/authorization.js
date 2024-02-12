const jwt = require('jsonwebtoken');

// Authorization for Role: TeamMember
const teamMemberAuth = (req, res, next) => {
    try{
        const token = req.headers[ 'authorization' ].split(' ')[1];
        jwt.verify(token, 'vacationcalendar', (err, decodedToken) => {
            if(decodedToken){
                req.userId = decodedToken.userId;
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
        const token = req.headers[ 'authorization' ].split(' ')[1];
        jwt.verify(token, 'vacationcalendar', (err, decodedToken) => {
            if(decodedToken && decodedToken.role === 'TeamLead'){
                req.userId = decodedToken.userId;
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
    try{
        const token = req.headers[ 'authorization' ].split(' ')[1];
        const decode = jwt.decode(token);
        console.log('decode: ', decode);
        jwt.verify(token, 'vacationcalendar', (err, decodedToken) => {
            if(decodedToken && decodedToken.defaultRole === 'administrator'){
                req.userId = decodedToken.userId;
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

module.exports = { teamMemberAuth, teamLeadAuth, adminAuth };