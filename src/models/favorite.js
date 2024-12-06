const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;