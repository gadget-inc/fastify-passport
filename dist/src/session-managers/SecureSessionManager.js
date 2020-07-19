"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureSessionManager = void 0;
class SecureSessionManager {
    constructor(options, serializeUser) {
        if (typeof options === "function") {
            serializeUser = options;
            options = undefined;
        }
        options = options || {};
        this.key = options.key || "passport";
        this.serializeUser = serializeUser;
    }
    logIn(request, user, cb) {
        this.serializeUser(user, request)
            .catch(cb)
            .then((obj) => {
            if (!request._passport.session) {
                request._passport.session = {};
            }
            request._passport.session.user = obj;
            request.session.set(this.key, request._passport.session);
            cb();
        });
    }
    logOut(request, cb) {
        if (request._passport && request._passport.session) {
            request.session.set(this.key, undefined);
        }
        if (cb) {
            cb();
        }
    }
}
exports.SecureSessionManager = SecureSessionManager;
//# sourceMappingURL=SecureSessionManager.js.map