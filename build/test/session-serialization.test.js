"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Authenticator_1 = __importDefault(require("../src/Authenticator"));
describe('Authenticator session serialization', () => {
    test('it should roundtrip a user', async () => {
        const fastifyPassport = new Authenticator_1.default();
        fastifyPassport.registerUserSerializer(async (user) => JSON.stringify(user));
        fastifyPassport.registerUserDeserializer(async (serialized) => JSON.parse(serialized));
        const user = { name: 'foobar' };
        const request = {};
        expect(await fastifyPassport.deserializeUser(await fastifyPassport.serializeUser(user, request), request)).toEqual(user);
    });
});
//# sourceMappingURL=session-serialization.test.js.map