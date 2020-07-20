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
    async logIn(request, user) {
        const object = await this.serializeUser(user, request);
        if (!request._passport.session) {
            request._passport.session = {};
        }
        request._passport.session.user = object;
        request.session.set(this.key, request._passport.session);
    }
    async logOut(request) {
        if (request._passport && request._passport.session) {
            request.session.set(this.key, undefined);
        }
    }
}
exports.SecureSessionManager = SecureSessionManager;
//# sourceMappingURL=SecureSessionManager.js.map