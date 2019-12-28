const express = require('express');
const fileupload = require('express-fileupload');
const fs = require('fs');
const imageService = require('../../db/services/image');

const router = express();

const requires_auth = (req, res, next) => {
  if (!req.custom_user || !req.custom_user.id) return res.status(401).send('Please login first');
  next();
};

router.use(fileupload());

router.get('/', async (req, res) => {
  try {
    const list = await imageService.get(req.query);
    res.send(list);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }

});

router.post('/', requires_auth, async (req, res) => {
  try {
    for (const file in req.files) {
      const fileName = file.split(' ').join('-');
      await fs.writeFile(`express/public/z-site-images/${fileName}`, req.files[file].data, async function (err) {
        if (err) {
          throw err;
        }
        await imageService.createWithUniqueName({
          name: fileName,
          ownerId: req.custom_user.id
        });
            
      });
    }
    res.send('Files saved');
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }
});
module.exports = router;