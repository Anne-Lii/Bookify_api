'use strict'

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');


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
        //get user
        const user = await User.findOne({email});
        const matchedPassword= await user.comparePassword(password);

        if (!user|| !matchedPassword) {
            return h.response({message: 'Wrong email or password'}).code(401);
        } else {
            //create JWT
            const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, 
                process.env.JWT_SECRET, {
                expiresIn: '1h'// jwt token valid for one hour
            });
    
            return h.response({ 
                user: { email: user.email, username: user.username },  //return email, username and token
                token 
            }).code(200);
        }
        
    } catch (error) {
        return h.response({ message: error.message }).code(500);
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