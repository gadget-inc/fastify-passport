"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = void 0;
async function logOut() {
    const property = this.passport.userProperty || "user";
    this[property] = null;
    this.passport.sessionManager.logOut(this);
}
exports.logOut = logOut;
//# sourceMappingURL=logout.js.map