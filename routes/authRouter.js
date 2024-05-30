const express = require('express');
const { doLogin, authenticateToken } = require('../controllers/authController');
const router = express.Router();

router.get('/dashboard', authenticateToken, (req, res) => {
    res.send('This is the dashboard page.');
});

router.post('/login', doLogin);

module.exports = router;