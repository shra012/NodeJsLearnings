process.env.MONGO_PASSWORD='xxxxxx';
process.env.OPEN_WEATHER_CURRENT_WEATHER_API_KEY='xxxxxx';
const app = require('../app');
const supertest = require('supertest');

describe('Plain text response', () => {
    let request;
    beforeEach(function() {
        request = supertest(app)
            .get("/user-agent")
            .set("User-Agent", "Supertest suite")
            .set("Accept", "text/plain");
    });
   it('returns plain text response', (done) => {
       request.expect("Content-Type", /text\/plain/)
           .expect(200)
           .end(done);
   });
    it('returns your user agent', (done) => {
        request.set("Accept", "text/plain")
            .expect(function(res) {
                if (res.text !== "Supertest suite") {
                    throw new Error("Response does not contain User Agent");
                }
            })
            .end(done);
    });
});