"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = void 0;
async function logIn(user, options = {}) {
    let property = "user";
    if (this._passport && this._passport.instance) {
        property = this._passport.instance._userProperty || "user";
    }
    const session = options.session === undefined ? true : options.session;
    this[property] = user;
    if (session) {
        if (!this._passport) {
            throw new Error("passport.initialize() plugin not in use");
        }
        try {
            await this._passport.instance._sessionManager.logIn(this, user);
        }
        catch (e) {
            this[property] = null;
            throw e;
        }
    }
}
exports.logIn = logIn;
//# sourceMappingURL=login.js.map