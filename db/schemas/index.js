'use strict'

module.exports = {
    userSchema: {
        allowed: ["firstName", "lastName", "userName", 'email', 'password', 'avatar'],
        properties: {
            firstName: {
                type: 'string',
                dataType: 'a'
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
    },
    loginSchema: {
        allowed: ["userName", 'password'],
        properties: {
            userName: {
                type: 'string',
                dataType: 'a'
            },
            password: {
                type: 'string'
            }
        }
    }
}