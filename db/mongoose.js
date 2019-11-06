const mongoose = require('mongoose');
const logger = require('../tools/logger');

require('dotenv').config();

function connectionString (){
  if (process.env.NODE_ENV === 'production') `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.DB_HOST}/${process.env.DATABASE}`
  else `mongodb://${process.env.DB_HOST}/${process.env.DATABASE}`
}

mongoose.connect(connectionString(), {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', (e)=> {
  logger.error(e.toString(), true);
  logger.error(e.stack, true);
  process.exit(999);
});

db.once('open', function() {
  logger.info('DB Connected Successfully');
});

module.exports = mongoose;