// registerController.js
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const RegisterUser = require('../Model/registerModel');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'khalilkapo15@gmail.com',
        pass: 'zwxntcgqnqxuyedv'
    },
    tls: {
        rejectUnauthorized: false 
    }
});

exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, birthdate } = req.body;

        // Check if email already exists in the database
        const existingUser = await RegisterUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Your age validation code here
        const today = new Date();
        const birthDate = new Date(birthdate);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            return res.status(400).json({ message: 'User must be at least 18 years old' });
        }

        const otpCode = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });

        const newUser = new RegisterUser({
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, 10),
            birthdate,
            role: 'user',
            otpCode: otpCode,
            active: false
        });

        await newUser.save();

        const mailOptions = {
            from: 'khalilkapo15@gmail.com',
            to: email,
            subject: 'OTP Verification Code',
            text: `Your OTP code is: ${otpCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to send OTP code' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'OTP code sent successfully' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otpCode } = req.body;
        const user = await RegisterUser.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otpCode !== otpCode) {
            return res.status(400).json({ message: 'Invalid OTP code' });
        }

        user.otpCode = null;
        user.active = true;
        await user.save();

        res.status(200).json({ message: 'OTP code verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
