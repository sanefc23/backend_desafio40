    const Config = require('../config/config');
    const mongoose = require('mongoose');

    class MongoDBClient {
        constructor() {}

        isValidId(id) {
            return mongoose.isValidObjectId(id);
        }

        async getConnection() {
            if (!MongoDBClient.client) {
                console.log('Connected to MongoDB');
                await mongoose.connect(Config.MONGO_ATLAS_URL, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    serverSelectionTimeoutMS: 1000
                });
                MongoDBClient.client = new MongoDBClient();
            }
            return MongoDBClient.client;
        }
    }

    module.exports = new MongoDBClient();