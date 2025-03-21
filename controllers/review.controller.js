'use strict';

const Review = require('../models/review.model');
const jwt = require('jsonwebtoken');

//CREATE a review
exports.createReview = async (request, h) => {
    try {
        //Get user ID from JWT
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const { bookId, reviewText, rating } = request.payload;

        //Create and save review
        const newReview = new Review({
            bookId,
            userId,
            reviewText,
            rating
        });

        await newReview.save();

        return h.response({ message: "Review created!", review: newReview }).code(201);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

//GET all reviews for a book
exports.getReviewsByBook = async (request, h) => {
    try {
        const { bookId } = request.params;
        const reviews = await Review.find({ bookId }).populate({
            path: 'userId',
            select: 'username',
        });
        

        if (reviews.length === 0) {
            return h.response({ message: "No reviews found for this book" }).code(404);
        }

        return h.response(reviews).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

// GET all reviews from a user
exports.getReviewsByUser = async (request, h) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const reviews = await Review.find({ userId });

        if (reviews.length === 0) {
            return h.response({ message: "No reviews found for this user" }).code(404);
        }

        return h.response(reviews).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};


//Update a review
exports.updateReview = async (request, h) => {
    try {
        const { reviewId } = request.params;
        const { reviewText, rating } = request.payload;

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { reviewText, rating, updatedAt: new Date() },
            { new: true }
          );

        if (!updatedReview) {
            return h.response({ message: "Review not found" }).code(404);
        }

        return h.response({ message: "Review updated!", review: updatedReview }).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

//delete a review
exports.deleteReview = async (request, h) => {
    try {
        const { reviewId } = request.params;

        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return h.response({ message: "Review not found" }).code(404);
        }

        return h.response({ message: "Review deleted!" }).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};
