const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    address: {
        type: {
            city: String,
            street: String,
            number: Number
        },
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    cart: {
        type: [
            {
                productId: {type: Number, required: true},
                quantity: {type: Number, required: true}
            }
        ]
    },
}, { versionKey: false });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;