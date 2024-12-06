const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        uniqe: true,
    },
    name: {
        type: String,
        required: true,
    },
    flavors: {
        type: [String],
        required: true,
    },
    allergans: {
        type: [String],
        required: true,
    },
    sweetType: {
        type: String,
        required: true,
    },
    kosher: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
        default: '/public/images/logo.svg',
    },
    inventory: {
        type: Number,
        required: true,
    },
    
}, { versionKey: false });

module.exports = mongoose.model('Products', productsSchema);