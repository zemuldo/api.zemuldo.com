const assert = require('assert');
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expectedResponse = require('../express/definitions/responses');

chai.use(chaiHttp);
const requester =chai.request(app);

describe('HTTP API', function() {
  describe('Root Path', function() {
    it('Should return OK', function(done) {
      this.timeout(5000);
      requester.get('/')
        .then((res)=>{
          assert.deepEqual(res.status, 200);
          assert.deepEqual(res.body, expectedResponse.rootPathResponse);
          done();
        })
        .catch(e=> done(e));
    });
  });
});