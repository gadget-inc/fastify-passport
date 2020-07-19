"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
function isAuthenticated() {
    let property = "user";
    if (this._passport && this._passport.instance) {
        property = this._passport.instance._userProperty || "user";
    }
    return this[property] ? true : false;
}
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=is-authenticated.js.map