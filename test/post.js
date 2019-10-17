process.env.DATABASE = 'zemuldo-test';
process.env.PORT = 8091;
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const token = require('../tools/jwt').sign(1);
const post = require('./fixtures/post');
const postService = require('../db/services/post');

const  expect = chai.expect;

let postId;

chai.use(chaiHttp);

describe('HTTP API', function() {
  describe('Posts API, for posts', function() {
    it('POST - /post, Should Create a post', function(done) {
      this.timeout(5000);
      chai.request(app)
        .post('/post')
        .set('authorization', token)
        .send(post)
        .then((res)=>{
          postId = res.body.post._id;
          expect(res.status).equal(200);
          expect(res.body).to.haveOwnProperty('post');
          expect(res.body).to.haveOwnProperty('body');
          expect(res.body.post.title).to.eql(post.title);
          expect(res.body.body.body).to.eql(post.body);
          done();
        })
        .catch(e=> done(e));
    });

    it('GET /post, Should Get posts', function(done) {
      this.timeout(5000);
      chai.request(app).get('/post')
        .then((res)=>{
          expect(res.status).equal(200);
          expect(res.body).to.be.a('array').length(1);
          expect(res.body[0].title).eql(post.title);
          done();
        })
        .catch(e=> done(e));
    });
  });

  after(function(done) {
    postService.deletePostById(postId)
      .then(()=>done())
      .catch(e=>done(e));
  });
});