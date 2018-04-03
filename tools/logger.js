const col = require('cli-color')

module.exports = {
    error: (mess) => {

        console.log(col.red.bold.underline(`++++++${JSON.stringify(mess)} , {worker:{pid:${process.pid}}}`))

    },
    warn: (mess) => {

        console.log(col.magenta(`++++++${JSON.stringify(mess)}, {worker:{pid:${process.pid}}}`))
    },
    success: (mess) => {

        console.log(col.green(`++++++${JSON.stringify(mess)}, {worker:{pid:${process.pid}}}`))

    },
    system: (mess) => {

        console.log(col.blue(`++++++${JSON.stringify(mess)}, {worker:{pid:${process.pid}}}`))

    },
    fail: (mess) => {

        console.log(col.red(`++++++${JSON.stringify(mess)}, {worker:{pid:${process.pid}}}`))

    },
    internal: (mess) => {

        console.log(col.white(`++++++${JSON.stringify(mess)}, {worker:{pid:${process.pid}}}`))

    },
    status: (mess) => {

        console.log(col.cyan(`++++++${JSON.stringify(mess)}, {worker:{pid:${process.pid}}}`))

    },
    timeout: (mess) => {

        console.log(col.yellow(`++++++${JSON.stringify(mess)}, {worker:{pid:${process.pid}}}`))

    },
    db: (mess) => {

        console.log(col.cyan(`++++++${JSON.stringify(mess)}, {worker:{pid:${process.pid}}}`))

    }
}