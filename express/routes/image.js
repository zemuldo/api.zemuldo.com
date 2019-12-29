const express = require('express');
const imageService = require('../../db/services/image');

const router = express();

const requires_auth = (req, res, next) => {
  if (!req.custom_user || !req.custom_user.id) return res.status(401).send('Please login first');
  next();
};

router.get('/', async (req, res) => {
  try {
    const list = await imageService.get(req.query);
    res.send(list);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }

});

router.post('/:name', requires_auth, async (req, res) => {
  try {
    await imageService.createWithUniqueName({
      name: req.params.name,
      ownerId: parseInt(req.custom_user.id, 16)
    });
    res.send('Files saved');
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }
});
module.exports = router;