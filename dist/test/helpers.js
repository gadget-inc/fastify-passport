"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguredTestServer = exports.request = exports.getTestServer = exports.TestStrategy = void 0;
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_secure_session_1 = __importDefault(require("fastify-secure-session"));
const Authenticator_1 = __importDefault(require("../src/Authenticator"));
const strategies_1 = require("../src/strategies");
const SecretKey = fs_1.default.readFileSync(__dirname + "/secure.key");
class TestStrategy extends strategies_1.Strategy {
    authenticate(request, _options) {
        if (request.isAuthenticated()) {
            return this.pass();
        }
        if (request.body && request.body.login === "test" && request.body.password === "test") {
            return this.success({ name: "test" });
        }
        this.fail();
    }
}
exports.TestStrategy = TestStrategy;
exports.getTestServer = () => {
    const server = fastify_1.default();
    server.register(fastify_secure_session_1.default, { key: SecretKey });
    return server;
};
exports.request = (options) => {
    return new Promise((resolve, reject) => {
        request_1.default(options, (error, response, body) => {
            if (error) {
                reject(error);
            }
            else {
                resolve({ response, body });
            }
        });
    });
};
exports.getConfiguredTestServer = (name = "test", strategy = new TestStrategy("test")) => {
    const fastifyPassport = new Authenticator_1.default();
    fastifyPassport.use(name, strategy);
    fastifyPassport.registerUserSerializer(async (user) => JSON.stringify(user));
    fastifyPassport.registerUserDeserializer(async (serialized) => JSON.parse(serialized));
    const server = exports.getTestServer();
    server.register(fastifyPassport.initialize());
    server.register(fastifyPassport.secureSession());
    return { fastifyPassport, server };
};
//# sourceMappingURL=helpers.js.map