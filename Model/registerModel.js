const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minlength: 3 },
    lastName: { type: String, required: true, minlength: 3 },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: { type: String, required: true },
    birthdate: { type: Date, required: true },
    role: { type: String, required: true, minlength: 3 },
    otpCode: { type: String },
    active: { type: Boolean, default: false },
    // favourits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;