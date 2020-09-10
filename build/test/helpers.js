"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguredTestServer = exports.getTestServer = exports.TestBrowserSession = exports.TestStrategy = exports.generateTestUser = void 0;
const fs_1 = __importDefault(require("fs"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_secure_session_1 = __importDefault(require("fastify-secure-session"));
const Authenticator_1 = __importDefault(require("../src/Authenticator"));
const strategies_1 = require("../src/strategies");
const set_cookie_parser_1 = __importDefault(require("set-cookie-parser"));
const SecretKey = fs_1.default.readFileSync(__dirname + '/secure.key');
let counter = 0;
exports.generateTestUser = () => ({ name: 'test', id: String(counter++) });
class TestStrategy extends strategies_1.Strategy {
    authenticate(request, _options) {
        if (request.isAuthenticated()) {
            return this.pass();
        }
        if (request.body && request.body.login === 'test' && request.body.password === 'test') {
            return this.success(exports.generateTestUser());
        }
        this.fail();
    }
}
exports.TestStrategy = TestStrategy;
class TestBrowserSession {
    constructor(server) {
        this.server = server;
        this.cookies = {};
    }
    async inject(opts) {
        opts.headers || (opts.headers = {});
        opts.headers.cookie = Object.entries(this.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');
        const result = await this.server.inject(opts);
        if (result.statusCode < 500) {
            for (const { name, value } of set_cookie_parser_1.default(result, { decodeValues: false })) {
                this.cookies[name] = value;
            }
        }
        return result;
    }
}
exports.TestBrowserSession = TestBrowserSession;
exports.getTestServer = () => {
    const server = fastify_1.default();
    void server.register(fastify_secure_session_1.default, { key: SecretKey });
    server.setErrorHandler((error, request, reply) => {
        console.error(error);
        void reply.status(500);
        void reply.send(error);
    });
    return server;
};
exports.getConfiguredTestServer = (name = 'test', strategy = new TestStrategy('test')) => {
    const fastifyPassport = new Authenticator_1.default();
    fastifyPassport.use(name, strategy);
    fastifyPassport.registerUserSerializer(async (user) => JSON.stringify(user));
    fastifyPassport.registerUserDeserializer(async (serialized) => JSON.parse(serialized));
    const server = exports.getTestServer();
    void server.register(fastifyPassport.initialize());
    void server.register(fastifyPassport.secureSession());
    return { fastifyPassport, server };
};
//# sourceMappingURL=helpers.js.map