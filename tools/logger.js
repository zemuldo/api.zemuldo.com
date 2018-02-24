module.exports = {
    error: (mess) => {
        console.log('\x1b[31m%s\x1b[0m', `${JSON.stringify(mess)}`)
    },
    warn: (mess) => {
        console.log('\x1b[31m%s\x1b[0m', `${JSON.stringify(mess)}`)
    },
    success: (mess) => {
        console.log('\x1b[31m%s\x1b[0m', `${JSON.stringify(mess)}`)
    },
    system: (mess) => {
        console.log('\x1b[31m%s\x1b[0m', `${JSON.stringify(mess)}`)
    },
    fail: (mess) => {
        console.log('\x1b[31m%s\x1b[0m', `${JSON.stringify(mess)}`)
    },
    internal: (mess) => {
        console.log('\x1b[31m%s\x1b[0m', `${JSON.stringify(mess)}`)
    },
    status: (mess) => {
        console.log('\x1b[31m%s\x1b[0m', `${JSON.stringify(mess)}`)
    },
    timeout: (mess) => {
        console.log('\x1b[31m%s\x1b[0m', `${JSON.stringify(mess)}`)
    },
    db: (mess) => {
        console.log('\x1b[31m%s\x1b[0m', `${JSON.stringify(mess)}`)
    }
}