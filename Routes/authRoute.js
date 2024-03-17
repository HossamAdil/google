const express = require('express');
const { login, forgetPassword, resetPassword , google} = require('../Controllers/authController');
const router = express.Router();

router.post('/login',login);

router.post('/forget-password', forgetPassword);

router.post('/reset-password', resetPassword);

router.post('/google', google);

module.exports = router;
