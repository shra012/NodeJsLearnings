process.env.MONGO_PASSWORD='xxxxxx';
process.env.OPEN_WEATHER_CURRENT_WEATHER_API_KEY='xxxxxx';
const app = require("../app");
const supertest = require("supertest");
const cheerio = require("cheerio");
describe("html response", () => {
    let request;
    beforeEach(() => {
        request = supertest(app)
            .get("/user-agent")
            .set("User-Agent", "Supertest suite")
            .set("Accept", "text/html");
    });
    it("returns an HTML response", (done) => {
        request
            .expect("Content-Type", /html/)
            .expect(200)
            .end(done);
    });
    it("returns your User Agent", (done) => {
        request
            .expect(function(res) {
                const htmlResponse = res.text;
                const $ = cheerio.load(htmlResponse);
                const userAgent = $(".user-agent").html().trim();
                if (userAgent !== "Supertest suite"){
                    throw new Error("User Agent not found");
                }
            })
            .end(done);
    });
});