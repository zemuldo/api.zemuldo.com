'use strict'

module.exports = {
    User: class user {
        constructor(data) {
            this.data = data
            this.schema = {
                additionalProperties: false,
                type: "object",
                required: ["firstName", "lastName", "userName", 'email', 'password', 'avatar'],
                properties: {
                    firstName: {
                        type: 'string',
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
        }
    }
}