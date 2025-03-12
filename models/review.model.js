'use strict';

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    
    //id for the review is created automatically
    bookId: { type: String, required: true }, //ID from Google Books API
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //user ID
    reviewText: { type: String, required: true },//review
    rating: { type: Number, required: true, min: 1, max: 5 }, //Rating 1-5
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
