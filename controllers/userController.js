const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const userController = {
    signup: async (request, response) => {
        try {
            // get the user inputs from the request body
            const { username, password, name } = request.body;

            // check if the user already exists in the database
            const user = await User.findOne({ username });

            // if the user exists, return an error
            if (user) {
                return response.status(400).json({ message: 'User already exists' });
            }

            // hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            // create a new user
            const newUser = new User({
                username,
                passwordHash,
                name,
            });

            // save the user to the database
            const savedUser = await newUser.save();

            // return the saved user
            response.json({ message: 'User created', user: savedUser });
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    },

    signin: async (request, response) => {
        try {
            // get the username and password from the request body
            const { username, password } = request.body;

            // check if the user exists in the database
            const user = await User.findOne({ username });

            // if the user does not exist, return an error
            if (!user) {
                return response.status(400).json({ message: 'User not found' });
            }

            // if the user exists, check if the password is correct
            const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

            // if the password is incorrect, return an error
            if (!passwordCorrect) {
                return response.status(400).json({ message: 'Invalid password' });
            }

            // if the password is correct, generate a token and return it
            const token = jwt.sign({
                username: user.username,
                id: user._id,
                name: user.name,
            }, config.JWT_SECRET);

            response.json({ message: 'User logged in', token });
        } catch(error) {
            response.status(500).json({ message: error.message });
        }
    }
}

module.exports = userController;