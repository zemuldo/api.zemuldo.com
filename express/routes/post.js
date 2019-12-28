const express = require('express');
const posts = require('../../db/services/post');

const router = express();

const requires_auth = (req, res, next) => {
  if (!req.custom_user || !req.custom_user.id) return res.status(401).send('Please login first');

  next();
};

router.get('/', async (req, res) => {
  try {
    const list = await posts.get(req.query);
    res.send(list);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }

});

router.get('/draft', requires_auth, async (req, res) => {
  try {
    const list = await posts.getDrafts();
    res.send(list);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }

});

router.get('/draft/:draftId', requires_auth, async (req, res) => {
  try {
    const { draftId } = req.params;
    const list = await posts.getDraftById(draftId);
    res.send(list);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }

});

router.delete('/draft/:draftId', requires_auth, async (req, res) => {
  try {
    const { draftId } = req.params;
    const deleted = await posts.deleteDraft(draftId);
    res.send(deleted);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }

});
router.post('/draft', requires_auth, async (req, res) => {
  try {
    const draft = await posts.createDraft({ ...req.body, authorId: req.custom_user.id });
    res.send(draft);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }

});
router.put('/draft/:_id', requires_auth, async (req, res) => {
  try {
    const { _id } = req.params;
    const draft = await posts.updateDraft({ update: { ...req.body, authorId: req.custom_user.id }, _id: _id });
    res.send(draft);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }

});
router.get('/latest', async (req, res) => {
  try {
    const post = await posts.getLatest();
    res.send(post);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }
});
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await posts.findById(postId);
    res.send(post);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }
});

router.post('/', requires_auth, async (req, res) => {
  try {
    if (!req.custom_user || !req.custom_user.id) throw Error('Please login first');
    const post = await posts.create({ ...req.body, authorId: req.custom_user.id });
    res.send(post);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }
});
router.post('/update/:postId', requires_auth, async (req, res) => {

  const { postId } = req.params;
  try {
    if (parseInt(req.custom_user.id, 10) !== parseInt(req.body.authorId, 10)) throw Error('You don\'t own this post!');
    posts.updatePost(req.body);
    const post = await posts.findById(postId);
    res.send(post);
  } catch (error) {
    res.status(400).send([{ errorType: 'BAD_REQUEST', errorMessage: error.toString() }]);
  }
});

module.exports = router;