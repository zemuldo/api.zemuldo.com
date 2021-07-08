const assert = require('assert');
process.env.MONGODB_DATABASE = 'zemuldo-test';
process.env.PORT = 8091;
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expectedResponse = require('../express/definitions/responses');

chai.use(chaiHttp);

describe('HTTP API', function() {
  describe('Root Path', function() {
    it('GET - /, Should return OK', function(done) {
      this.timeout(5000);
      chai.request(app).get('/')
        .then((res)=>{
          assert.deepEqual(res.status, 200);
          assert.deepEqual(res.body, expectedResponse.rootPathResponse);
          done();
        })
        .catch(e=> done(e));
    });
  });
});