'use strict'

//includes
const Hapi = require('@hapi/hapi'); //require hapi
const mongoose = require('mongoose'); //Imports Mongoose library 

require('dotenv').config(); //Get environment variables from the .env file

const AuthRoutes = require('./routes/auth.route');

const init = async () => {

    // Creates a new Hapi server instance with CORS enabled
    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: '0.0.0.0', 
        routes: {
            cors: {
                origin: ['*'], // Allow all origins.
                headers: ['Accept', 'Content-Type', 'Authorization'], //allow authorization
                credentials: false
            }
        },
        
    });

    //Connect to MongoDB database
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB database');
    }).catch((error) => {
        console.error('Couldn´t connect to MongoDB', error);
    });

    //Routes
    server.route(AuthRoutes);

    //starting server
    await server.start();
    console.log('Server is running on: ', server.info.uri);

};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

//Call the init function to start the server
init(); 