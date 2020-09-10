"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const passport_google_oauth_1 = require("passport-google-oauth");
const passport_facebook_1 = require("passport-facebook");
const passport_github2_1 = require("passport-github2");
test('should initiate oauth with the google strategy from npm', async () => {
    const strategy = new passport_google_oauth_1.OAuth2Strategy({
        clientID: '384163122467-cq6dolrp53at1a3pa8j0f4stpa5gvouh.apps.googleusercontent.com',
        clientSecret: 'o15Chw0KIaXtx_2wRGxNdNSy',
        callbackURL: 'http://www.example.com/auth/google/callback',
    }, () => fail());
    const { server, fastifyPassport } = helpers_1.getConfiguredTestServer('google', strategy);
    server.get('/', { preValidation: fastifyPassport.authenticate('google', { authInfo: false }) }, async () => 'hello world!');
    server.post('/login', { preValidation: fastifyPassport.authenticate('google', { authInfo: false }) }, async () => 'hello');
    const response = await server.inject({ method: 'GET', url: '/' });
    expect(response.statusCode).toEqual(302);
});
test('should initiate oauth with the facebook strategy from npm', async () => {
    const strategy = new passport_facebook_1.Strategy({
        clientID: 'foobar',
        clientSecret: 'baz',
        callbackURL: 'http://www.example.com/auth/facebook/callback',
    }, () => fail());
    const { server, fastifyPassport } = helpers_1.getConfiguredTestServer('facebook', strategy);
    server.get('/', { preValidation: fastifyPassport.authenticate('facebook', { authInfo: false }) }, async () => 'hello world!');
    server.post('/login', { preValidation: fastifyPassport.authenticate('facebook', { authInfo: false }) }, async () => 'hello');
    const response = await server.inject({ method: 'GET', url: '/' });
    expect(response.statusCode).toEqual(302);
});
test('should initiate oauth with the github strategy from npm', async () => {
    const strategy = new passport_github2_1.Strategy({
        clientID: 'foobar',
        clientSecret: 'baz',
        callbackURL: 'http://www.example.com/auth/facebook/callback',
    }, () => fail());
    const { server, fastifyPassport } = helpers_1.getConfiguredTestServer('github', strategy);
    server.get('/', { preValidation: fastifyPassport.authenticate('github', { authInfo: false }) }, async () => 'hello world!');
    server.post('/login', { preValidation: fastifyPassport.authenticate('github', { authInfo: false }) }, async () => 'hello');
    const response = await server.inject({ method: 'GET', url: '/' });
    expect(response.statusCode).toEqual(302);
});
//# sourceMappingURL=strategies-integration.test.js.map