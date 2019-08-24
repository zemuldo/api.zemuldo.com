const User = require('../models/user')

module.exports = {
    findOrCreate: async (oAuthData) =>{
        const user = await User.findOne({oAuthId: oAuthData.oAuthId})
        if(!user) {
            const newUser = new User(oAuthData, { strict: false })
            await newUser.save()
            return newUser
        }
        return user;
    }
}