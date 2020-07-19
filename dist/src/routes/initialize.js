"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const decorators_1 = require("../decorators");
const fastify_flash_1 = __importDefault(require("fastify-flash"));
function initializeFactory(passport, options = {}) {
    const preValidator = async (request) => {
        const sessionKey = request._passport.instance._key;
        request._passport.session = request.session.get(sessionKey);
    };
    return fastify_plugin_1.default(async (fastify) => {
        fastify.register(fastify_flash_1.default);
        fastify.decorateRequest("_passport", { instance: passport });
        fastify.addHook("preValidation", preValidator);
        fastify.decorateRequest("logIn", decorators_1.logIn);
        fastify.decorateRequest("login", decorators_1.logIn);
        fastify.decorateRequest("logOut", decorators_1.logOut);
        fastify.decorateRequest("logout", decorators_1.logOut);
        fastify.decorateRequest("isAuthenticated", decorators_1.isAuthenticated);
        fastify.decorateRequest("isUnauthenticated", decorators_1.isUnauthenticated);
        fastify.decorateRequest(options.userProperty || "user", null);
    });
}
exports.default = initializeFactory;
//# sourceMappingURL=initialize.js.map