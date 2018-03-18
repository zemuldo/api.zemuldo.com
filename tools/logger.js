const col = require('cli-color')

module.exports = {
    error: (mess) => {
        console.log('----------------------------------')
        console.log(col.red.bold.underline(`${JSON.stringify(mess)}`))
        console.log('+++++++++++++++++++++++++++++++++++')
    },
    warn: (mess) => {
        console.log('----------------------------------')
        console.log(col.magenta(`${JSON.stringify(mess)}`))
    },
    success: (mess) => {
        console.log('----------------------------------')
        console.log(col.green(`${JSON.stringify(mess)}`))
        console.log('+++++++++++++++++++++++++++++++++++')
    },
    system: (mess) => {
        console.log('----------------------------------')
        console.log(col.blue(`${JSON.stringify(mess)}`))
        console.log('+++++++++++++++++++++++++++++++++++')
    },
    fail: (mess) => {
        console.log('----------------------------------')
        console.log(col.red(`${JSON.stringify(mess)}`))
        console.log('+++++++++++++++++++++++++++++++++++')
    },
    internal: (mess) => {
        console.log('----------------------------------')
        console.log(col.white(`${JSON.stringify(mess)}`))
        console.log('+++++++++++++++++++++++++++++++++++')
    },
    status: (mess) => {
        console.log('----------------------------------')
        console.log(col.cyan(`${JSON.stringify(mess)}`))
        console.log('+++++++++++++++++++++++++++++++++++')
    },
    timeout: (mess) => {
        console.log('----------------------------------')
        console.log(col.yellow(`${JSON.stringify(mess)}`))
        console.log('+++++++++++++++++++++++++++++++++++')
    },
    db: (mess) => {
        console.log('----------------------------------')
        console.log(col.cyan(`${JSON.stringify(mess)}`))
        console.log('+++++++++++++++++++++++++++++++++++')
    }
}