"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticator = void 0;
const SecureSessionManager_1 = require("./session-managers/SecureSessionManager");
const strategies_1 = require("./strategies");
const AuthenticationRoute_1 = require("./routes/AuthenticationRoute");
const initialize_1 = __importDefault(require("./routes/initialize"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
class Authenticator {
    constructor() {
        this._strategies = {};
        this._serializers = [];
        this._deserializers = [];
        this._infoTransformers = [];
        this._key = "passport";
        this._userProperty = "user";
        this.use(new strategies_1.SessionStrategy(this.deserializeUser.bind(this)));
        this._sessionManager = new SecureSessionManager_1.SecureSessionManager({ key: this._key }, this.serializeUser.bind(this));
    }
    use(name, strategy) {
        if (!strategy) {
            strategy = name;
            name = strategy.name;
        }
        if (!name) {
            throw new Error("Authentication strategies must have a name");
        }
        this._strategies[name] = strategy;
        return this;
    }
    unuse(name) {
        delete this._strategies[name];
        return this;
    }
    initialize(options) {
        return initialize_1.default(this, options);
    }
    authenticate(strategyOrStrategies, optionsOrCallback, callback) {
        let options;
        if (typeof optionsOrCallback == "function") {
            options = {};
            callback = optionsOrCallback;
        }
        else {
            options = optionsOrCallback;
        }
        return new AuthenticationRoute_1.AuthenticationRoute(this, strategyOrStrategies, options, callback).handler;
    }
    authorize(strategyOrStrategies, optionsOrCallback, callback) {
        let options;
        if (typeof optionsOrCallback == "function") {
            options = {};
            callback = optionsOrCallback;
        }
        else {
            options = optionsOrCallback;
        }
        options.assignProperty = "account";
        return new AuthenticationRoute_1.AuthenticationRoute(this, strategyOrStrategies, options, callback).handler;
    }
    secureSession(options) {
        return fastify_plugin_1.default(async (fastify) => {
            fastify.addHook("preValidation", new AuthenticationRoute_1.AuthenticationRoute(this, "session", options).handler);
        });
    }
    registerUserSerializer(fn) {
        this._serializers.push(fn);
    }
    async serializeUser(user, request) {
        const result = this.runStack(this._serializers, user, request);
        if (result) {
            return result;
        }
        else {
            throw new Error(`Failed to serialize user into session. Tried ${this._serializers.length} serializers.`);
        }
    }
    registerUserDeserializer(fn) {
        this._deserializers.push(fn);
    }
    async deserializeUser(stored, request) {
        const result = this.runStack(this._deserializers, stored, request);
        if (result) {
            return result;
        }
        else {
            throw new Error(`Failed to deserialize user out of session. Tried ${this._deserializers.length} serializers.`);
        }
    }
    registerAuthInfoTransformer(fn) {
        this._infoTransformers.push(fn);
    }
    transformAuthInfo(info, request) {
        const result = this.runStack(this._infoTransformers, info, request);
        return result || info;
    }
    strategy(name) {
        return this._strategies[name];
    }
    async runStack(stack, ...args) {
        for (const attempt of stack) {
            try {
                return await attempt(...args);
            }
            catch (e) {
                if (e == "pass") {
                    continue;
                }
                else {
                    throw e;
                }
            }
        }
    }
}
exports.Authenticator = Authenticator;
exports.default = Authenticator;
//# sourceMappingURL=authenticator.js.map