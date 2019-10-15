module.exports = (d1, d2) => {
    _d1 = new Date(d1)
    _d2 = new Date(d2)

    return _d1.getTime() === _d2.getTime()
}