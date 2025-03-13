'use strict'

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');


//register a new user
exports.register = async (request, h) => {
    const { username, email, password } = request.payload;

    try {

        const existingUser = await User.findOne({email});

        if (existingUser) {
            return h.response({message: 'Email already in use'}).code(400);
        } else {
            const newUser = new User ({username, email, password});
            await newUser.save();

            return h.response({ message: 'User created!' }).code(201);

        }
        
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

//login
exports.login = async (request, h) => {
    const { email, password } = request.payload;

    try {
        //get user from database
        const user = await User.findOne({ email });
        if (!user) {
            return h.response({ message: 'Wrong e-mail or password' }).code(401);
        }

        //compare input password with database
        const matchedPassword = await user.comparePassword(password);
        if (!matchedPassword) {
            return h.response({ message: 'Wrong e-mail or password' }).code(401);
        }

        //create JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' } //token valid for one hour
        );

        //log expiration time
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token expiration:", new Date(decoded.exp * 1000));

        return h.response({ 
            user: { email: user.email, username: user.username }, 
            token 
        }).code(200);

    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};


//Delete user - only authorized user can delete its own account
exports.deleteUser = async (request, h) => {
    try {
        //Get user ID from JWT
        const userIdFromToken = request.auth.credentials.id; 
        
        //Get ID from request params
        const { id } = request.params;

        //Check if user trying to delete his own account (matching ID)
        if (userIdFromToken !== id) {
            return Boom.forbidden('You don´t have the authority to delete this account');
        }

        //Delete user from database
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return Boom.notFound('User could not be found.');
        }

        return h.response({ message: 'Account deleted' }).code(200);
    } catch (error) {
        console.error(error);
        return Boom.badImplementation('Error accured trying to remove account.');
    }
};


//validate token
exports.validateToken = (request, h) => {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
        return h.response({ message: 'Can´t find token' }).code(403);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return h.response({ valid: true, user: decoded }).code(200);
    } catch (error) {
        return h.response({ valid: false, message: 'Token unvalid' }).code(401);
    }
};