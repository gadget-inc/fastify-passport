"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
function isAuthenticated() {
    let property = 'user';
    if (this.passport && this.passport) {
        property = this.passport.userProperty || 'user';
    }
    return this[property] ? true : false;
}
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=is-authenticated.js.map