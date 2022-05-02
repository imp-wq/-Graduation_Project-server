const mongoose = require('mongoose');
const Order = require('./Order');


const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please provide your first name']
    },
    email: {
        type: String,
        required: [true, 'please provide your email address']
    },
    password: {
        type: String,
        required: [true, 'You need a password to create an account'],
        match: /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
        select:false
    },
    orders: [Order.schema],
});

const User = mongoose.model('User', userSchema, 'User');

module.exports = User;