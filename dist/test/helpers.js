"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguredTestServer = exports.request = exports.getTestServer = exports.TestBrowserSession = exports.TestStrategy = void 0;
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_secure_session_1 = __importDefault(require("fastify-secure-session"));
const Authenticator_1 = __importDefault(require("../src/Authenticator"));
const strategies_1 = require("../src/strategies");
const set_cookie_parser_1 = __importDefault(require("set-cookie-parser"));
const SecretKey = fs_1.default.readFileSync(__dirname + "/secure.key");
let counter = 0;
class TestStrategy extends strategies_1.Strategy {
    authenticate(request, _options) {
        if (request.isAuthenticated()) {
            return this.pass();
        }
        if (request.body && request.body.login === "test" && request.body.password === "test") {
            return this.success({ name: "test", id: String(counter++) });
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
            .join("; ");
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
    server.register(fastify_secure_session_1.default, { key: SecretKey });
    server.setErrorHandler((error, request, reply) => {
        console.error(error);
        reply.status(500);
        reply.send(error);
    });
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