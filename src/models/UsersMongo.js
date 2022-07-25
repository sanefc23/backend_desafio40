const mongoose = require("mongoose");
require('mongoose-type-email');
const logger = require('../services/logger');
const MongoDBClient = require('../services/dbMongo');

const Schema = mongoose.Schema;

const usersCollection = 'users';

const usersSchema = new Schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    name: {
        type: String,
        required: true,
        max: [30, "Max length is 30 characters"]
    },
    lastName: {
        type: String,
        required: true,
        max: [30, "Max length is 30 characters"]
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    }
});

class Users {
    users
    constructor() {
        MongoDBClient.getConnection();
        this.users = mongoose.model(usersCollection, usersSchema);
    }

    async getByEmail(email) {
        try {
            const response = await this.users.findOne({
                email: email
            })
            return response;
        } catch (error) {
            logger.error(error.message)
            throw new Error(`Error getting users: ${error.message}`)
        }
    }

    async postUser(user) {
        try {
            const newUser = new this.users(user)
            await newUser.save()
            return newUser
        } catch (error) {
            logger.error(error.message)
            throw new Error(`Error creating user: ${error.message}`)
        }
    }
}

module.exports = new Users();