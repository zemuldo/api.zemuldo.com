module.exports = (_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
    res.header('Allow-Control-Access-Method', 'POST');
    next();
}
