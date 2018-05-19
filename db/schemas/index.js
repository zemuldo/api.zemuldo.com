'use strict'

module.exports = {
    allowed: ["firstName", "lastName", "userName", 'email', 'password', 'avatar'],
    properties: {
        firstName: {
            type: 'string',
            dataType:'a'
        },
        lastName: {
            type: 'string'
        },
        userName: {
            type: 'string'
        },
        email: {
            type: "string",
            format: "email"
        },
        password: {
            type: 'string'
        },
        avatar: {
            type: 'string'
        }
    }
}
