"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitializePlugin = void 0;
const fastify_plugin_1 = require("fastify-plugin");
const decorators_1 = require("./decorators");
const flash = require("fastify-flash");
function CreateInitializePlugin(passport, options = {}) {
    return fastify_plugin_1.default(async (fastify) => {
        void fastify.register(flash);
        fastify.decorateRequest('passport', passport);
        fastify.decorateRequest('logIn', decorators_1.logIn);
        fastify.decorateRequest('login', decorators_1.logIn);
        fastify.decorateRequest('logOut', decorators_1.logOut);
        fastify.decorateRequest('logout', decorators_1.logOut);
        fastify.decorateRequest('isAuthenticated', decorators_1.isAuthenticated);
        fastify.decorateRequest('isUnauthenticated', decorators_1.isUnauthenticated);
        fastify.decorateRequest(options.userProperty || 'user', null);
    });
}
exports.CreateInitializePlugin = CreateInitializePlugin;
