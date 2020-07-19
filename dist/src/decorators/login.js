"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = void 0;
function logIn(user, options, done) {
    if (typeof options === "function") {
        done = options;
        options = { session: false };
    }
    options = options || {};
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
        if (typeof done !== "function") {
            throw new Error("req.login requires a callback function");
        }
        const self = this;
        this._passport.instance._sessionManager.logIn(this, user, function (err) {
            if (err) {
                self[property] = null;
                return done(err);
            }
            done();
        });
    }
    else {
        if (done) {
            done();
        }
    }
}
exports.logIn = logIn;
//# sourceMappingURL=login.js.map