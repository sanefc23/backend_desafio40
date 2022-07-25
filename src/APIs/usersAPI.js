const Users = require('../models/UsersMongo');

const UsersAPI = {
    getByEmail: async (email) => await Users.getByEmail(email),
    register: async (user) => await Users.postUser(user),
}

module.exports = UsersAPI