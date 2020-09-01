"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestThirdPartyStrategy = void 0;
const helpers_1 = require("./helpers");
const src_1 = require("../src");
class TestThirdPartyStrategy extends src_1.Strategy {
    authenticate(_request, _options) {
        return this.success(helpers_1.generateTestUser());
    }
}
exports.TestThirdPartyStrategy = TestThirdPartyStrategy;
describe(".authorize", () => {
    test(`should return 401 Unauthorized if not logged in`, async () => {
        const { server, fastifyPassport } = helpers_1.getConfiguredTestServer();
        fastifyPassport.use(new TestThirdPartyStrategy("third-party"));
        server.get("/", { preValidation: fastifyPassport.authorize("third-party") }, async (request) => {
            expect(request.user).toBeFalsy();
            expect(request.account.id).toBeTruthy();
            expect(request.account.name).toEqual("test");
            return "it worked";
        });
        const response = await server.inject({ method: "GET", url: "/" });
        expect(response.statusCode).toEqual(200);
    });
});
//# sourceMappingURL=authorize.test.js.map