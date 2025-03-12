'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:      {type: String, required: true, unique: true},
    password:   {type: String, required: true}
});

//Hash password with bcrypt before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) 
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//compare password when login
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);