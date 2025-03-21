'use strict';

const ReviewController = require('../controllers/review.controller');

module.exports = [
    { method: 'POST',   path: '/reviews',               handler: ReviewController.createReview, options: { auth: 'jwt' } },//create review
    { method: 'GET',    path: '/reviews/book/{bookId}', handler: ReviewController.getReviewsByBook }, //public, no need for jwt
    { method: 'GET',    path: '/reviews/user',          handler: ReviewController.getReviewsByUser, options: { auth: 'jwt' } }, //user-specific reviews
    { method: 'PUT',    path: '/reviews/{reviewId}',    handler: ReviewController.updateReview, options: { auth: 'jwt' } }, //update review
    { method: 'DELETE', path: '/reviews/{reviewId}',    handler: ReviewController.deleteReview, options: { auth: 'jwt' } }  //Delete review
];
