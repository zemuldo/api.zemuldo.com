const mongoose = require('mongoose');
const logger = require('../tools/logger');
const tags = require('./data/meta_tags');

require('dotenv').config();

function connectionString (){
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  else if (process.env.NODE_ENV === 'production') return `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.DB_HOST}/${process.env.DATABASE}`;
  else return `mongodb://${process.env.DB_HOST}/${process.env.DATABASE}`;
}

mongoose.connect(connectionString(), {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', (e)=> {
  logger.error(e.toString(), true);
  logger.error(e.stack, true);
  process.exit(999);
});

db.once('open', async function() {
  logger.info('DB Connected Successfully');
  logger.info('Seeding tags');

  const Tag = require('./models/tag');
  await tags.map((t)=>{
    const tag = new Tag({...t, _id: t.value});
    tag.save()
      .then((_d)=>true)
      .catch(_e=>false);

  });
});

module.exports = mongoose;