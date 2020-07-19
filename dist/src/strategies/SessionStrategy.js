"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStrategy = void 0;
const base_1 = require("./base");
class SessionStrategy extends base_1.Strategy {
    constructor(options, deserializeUser) {
        super("session");
        if (typeof options === "function") {
            deserializeUser = options;
            options = undefined;
        }
        options = options || {};
        this.deserializeUser = deserializeUser;
    }
    authenticate(request, options) {
        if (!request._passport) {
            return this.error(new Error("passport.initialize() plugin not in use"));
        }
        options = options || {};
        if (options.pauseStream) {
            return this.error(new Error("fastify-passport doesn't support pauseStream option."));
        }
        let sessionUser;
        if (request._passport.session) {
            sessionUser = request._passport.session.user;
        }
        if (sessionUser || sessionUser === 0) {
            this.deserializeUser(sessionUser, request)
                .catch((err) => this.error(err))
                .then((user) => {
                if (!user) {
                    delete request._passport.session.user;
                }
                else {
                    const property = request._passport.instance._userProperty || "user";
                    request[property] = user;
                }
                this.pass();
            });
        }
        else {
            this.pass();
        }
    }
}
exports.SessionStrategy = SessionStrategy;
//# sourceMappingURL=SessionStrategy.js.map