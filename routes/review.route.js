'use strict';

const ReviewController = require('../controllers/review.controller');

module.exports = [
    { method: 'POST',   path: '/reviews',               handler: ReviewController.createReview }, //create review
    { method: 'GET',    path: '/reviews/book/{bookId}', handler: ReviewController.getReviewsByBook }, //get reviews for a book
    { method: 'GET',    path: '/reviews/user',          handler: ReviewController.getReviewsByUser, options: {auth: 'jwt'} }, //get reviews for a user
    { method: 'PUT',    path: '/reviews/{reviewId}',    handler: ReviewController.updateReview }, //Update a review
    { method: 'DELETE', path: '/reviews/{reviewId}',    handler: ReviewController.deleteReview } //delete a review
];
