'use strict'

const AuthController = require('../controllers/auth.controller');

module.exports = [

    //endpoint register
    {method: 'POST', path: '/register', handler: AuthController.register},

    //endpoint login
    {method: 'POST', path: '/login', handler: AuthController.login},

    //endpoint to validate token
    { method: 'GET', path: '/validate', handler: AuthController.validateToken },

    //endpoint to delete your own account
    {method: 'DELETE', path: '/users/{id}', handler: AuthController.deleteUser, options:{ auth: 'jwt'}}
];