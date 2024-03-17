const nodemailer = require('nodemailer');
const Subscription = require('../Model/subscribeModel');

const sendSubscriptionEmail = async (req, res) => {
    try {
        const { senderEmail, subject, text } = req.body;
        const subscription = new Subscription({ senderEmail, subject, text });
        await subscription.save();

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

        const mailOptions = {
            from: senderEmail,
            to: 'khalilkapo15@gmail.com',
            subject: subject,
            text: text
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ status: 'success', message: 'Subscription email sent successfully' });
    } catch (error) {
        console.error('Error sending subscription email:', error);
        res.status(500).json({ status: 'error', message: 'Failed to send subscription email' });
    }
};

module.exports = {
    sendSubscriptionEmail
};
