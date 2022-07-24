const Users = require('../models/users');

class UsersAPI {
    async getUserByEmail(user) {
        return await Users.getUserByEmail(user)
    }

    async postUser(user) {
        return await Users.postUser(user)
    }

    async updateUser(user) {
        return await Users.updateUser(user)
    }

    async validateUserPassword(user, password) {
        return await Users.validateUserPassword(user, password)
    }
}

const usersAPI = new UsersAPI()
export default usersAPI