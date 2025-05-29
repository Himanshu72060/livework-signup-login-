const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, // Optional: only accept 10-digit numbers
    },
});

module.exports = mongoose.model('User', userSchema);
