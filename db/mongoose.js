const mongoose = require('mongoose');
const logger = require('../tools/logger')

require('dotenv').config()

mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DATABASE}`, {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', ()=> process.exit(999));
db.once('open', function() {
  logger.info("DB Connected Successfully")
});

module.exports = mongoose;