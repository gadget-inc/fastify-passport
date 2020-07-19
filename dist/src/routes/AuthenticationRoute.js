"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationRoute = void 0;
const http_1 = __importDefault(require("http"));
const errors_1 = __importDefault(require("../errors"));
require("../types/fastify");
const addMessage = (request, message) => {
    const existing = request.session.get("messages");
    const messages = existing ? [...existing, message] : [message];
    request.session.set("messages", messages);
};
const Unhandled = Symbol.for("passport-unhandled");
class AuthenticationRoute {
    constructor(authenticator, strategyOrStrategies, options, callback) {
        this.authenticator = authenticator;
        this.callback = callback;
        this.handler = async (request, reply) => {
            if (!request._passport) {
                throw new Error("passport.initialize() plugin not in use");
            }
            const failures = [];
            for (const strategy of this.strategies) {
                try {
                    return await this.attemptStrategy(failures, strategy, request, reply);
                }
                catch (e) {
                    if (e == Unhandled) {
                        continue;
                    }
                    else {
                        throw e;
                    }
                }
            }
            return this.onAllFailed(failures, request, reply);
        };
        this.options = options || {};
        if (Array.isArray(strategyOrStrategies)) {
            this.strategies = strategyOrStrategies;
            this.isMultiStrategy = false;
        }
        else {
            this.strategies = [strategyOrStrategies];
            this.isMultiStrategy = false;
        }
    }
    async attemptStrategy(failures, name, request, reply) {
        const prototype = this.authenticator.strategy(name);
        if (!prototype) {
            throw new Error(`Unknown authentication strategy ${name}!`);
        }
        const strategy = Object.create(prototype);
        return new Promise((resolve, reject) => {
            strategy.success = (user, info) => {
                request.log.debug(`passport strategy ${name} success`);
                if (this.callback) {
                    resolve(this.callback(request, reply, null, user, info));
                }
                info = info || {};
                this.applyFlashOrMessage("success", request, info);
                if (this.options.assignProperty) {
                    request[this.options.assignProperty] = user;
                    return resolve();
                }
                request.logIn(user, this.options, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    const complete = () => {
                        if (this.options.successReturnToOrRedirect) {
                            let url = this.options.successReturnToOrRedirect;
                            if (request.session && request.session.get("returnTo")) {
                                url = request.session.get("returnTo");
                                request.session.set("returnTo", undefined);
                            }
                            reply.redirect(url);
                        }
                        else if (this.options.successRedirect) {
                            reply.redirect(this.options.successRedirect);
                        }
                        return resolve();
                    };
                    if (this.options.authInfo !== false) {
                        this.authenticator
                            .transformAuthInfo(info, request)
                            .catch(reject)
                            .then((transformedInfo) => {
                            request.authInfo = transformedInfo;
                            complete();
                        });
                    }
                    else {
                        complete();
                    }
                });
            };
            strategy.fail = function (challenge, status) {
                if (typeof challenge === "number") {
                    status = challenge;
                    challenge = undefined;
                }
                failures.push({ challenge, status: status });
                reject(Unhandled);
            };
            strategy.redirect = (url, status) => {
                reply.status(status || 302);
                reply.redirect(url);
                resolve();
            };
            strategy.pass = () => resolve();
            strategy.error = (err) => {
                if (this.callback) {
                    return resolve(this.callback(request, reply, err));
                }
                reject(err);
            };
            strategy.authenticate(request, this.options);
        });
    }
    async onAllFailed(failures, request, reply) {
        var _a;
        if (this.callback) {
            if (this.isMultiStrategy) {
                const challenges = failures.map((f) => f.challenge);
                const statuses = failures.map((f) => f.status);
                return await this.callback(request, reply, null, false, challenges, statuses);
            }
            else {
                return await this.callback(request, reply, null, false, failures[0].challenge, failures[0].status);
            }
        }
        this.applyFlashOrMessage("failure", request, this.toFlashObject((_a = failures[0]) === null || _a === void 0 ? void 0 : _a.challenge, "error"));
        if (this.options.failureRedirect) {
            return reply.redirect(this.options.failureRedirect);
        }
        const rchallenge = [];
        let rstatus;
        for (const failure of failures) {
            rstatus = rstatus || failure.status;
            if (typeof failure.challenge === "string") {
                rchallenge.push(failure.challenge);
            }
        }
        rstatus = rstatus || 401;
        reply.code(rstatus);
        if (reply.statusCode === 401 && rchallenge.length) {
            reply.header("WWW-Authenticate", rchallenge);
        }
        if (this.options.failWithError) {
            throw new errors_1.default(http_1.default.STATUS_CODES[reply.statusCode], rstatus);
        }
        reply.send(http_1.default.STATUS_CODES[reply.statusCode]);
    }
    applyFlashOrMessage(event, request, result) {
        var _a;
        const flashOption = this.options[event + "Flash"];
        const level = event == "success" ? "success" : "error";
        if (flashOption) {
            let flash;
            if (typeof flashOption === "boolean") {
                flash = this.toFlashObject(result, level);
            }
            else {
                flash = this.toFlashObject(flashOption, level);
            }
            if (flash && flash.type && flash.message) {
                request.flash(flash.type, flash.message);
            }
        }
        const messageOption = this.options[event + "Message"];
        if (messageOption) {
            const message = typeof messageOption === "boolean" ? (_a = this.toFlashObject(result, level)) === null || _a === void 0 ? void 0 : _a.message : messageOption;
            if (message) {
                addMessage(request, message);
            }
        }
    }
    toFlashObject(input, type) {
        if (typeof input == "undefined") {
            return;
        }
        else if (typeof input == "string") {
            return { type, message: input };
        }
        else {
            return input;
        }
    }
}
exports.AuthenticationRoute = AuthenticationRoute;
//# sourceMappingURL=AuthenticationRoute.js.map