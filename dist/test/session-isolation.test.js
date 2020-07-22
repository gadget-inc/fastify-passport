"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const { server, fastifyPassport } = helpers_1.getConfiguredTestServer();
server.get("/protected", { preValidation: fastifyPassport.authenticate("test", { authInfo: false }) }, async () => "hello!");
server.get("/my-id", { preValidation: fastifyPassport.authenticate("test", { authInfo: false }) }, async (request) => String(request.user.id));
server.post("/login", { preValidation: fastifyPassport.authenticate("test", { authInfo: false }) }, async () => "success");
server.post("/logout", { preValidation: fastifyPassport.authenticate("test", { authInfo: false }) }, async (request, reply) => {
    await request.logout();
    reply.send("logged out");
});
test(`should return 401 Unauthorized if not logged in`, async () => {
    const userA = new helpers_1.TestBrowserSession(server);
    const userB = new helpers_1.TestBrowserSession(server);
    const userC = new helpers_1.TestBrowserSession(server);
    await Promise.all([userA, userB, userC].map(async (user) => {
        const response = await user.inject({ method: "GET", url: "/protected" });
        expect(response.statusCode).toEqual(401);
    }));
    await Promise.all([userA, userB, userC].map(async (user) => {
        const response = await user.inject({ method: "GET", url: "/protected" });
        expect(response.statusCode).toEqual(401);
    }));
});
test(`logging in one user shouldn't log in the others`, async () => {
    const userA = new helpers_1.TestBrowserSession(server);
    const userB = new helpers_1.TestBrowserSession(server);
    const userC = new helpers_1.TestBrowserSession(server);
    await Promise.all([userA, userB, userC].map(async (user) => {
        const response = await user.inject({ method: "GET", url: "/protected" });
        expect(response.statusCode).toEqual(401);
    }));
    let response = await userA.inject({ method: "POST", url: "/login", payload: { login: "test", password: "test" } });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual("success");
    response = await userA.inject({ method: "GET", url: "/protected" });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual("hello!");
    await Promise.all([userB, userC].map(async (user) => {
        const response = await user.inject({ method: "GET", url: "/protected" });
        expect(response.statusCode).toEqual(401);
    }));
    response = await userA.inject({ method: "GET", url: "/protected" });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual("hello!");
});
test(`logging in each user should keep their sessions independent`, async () => {
    const userA = new helpers_1.TestBrowserSession(server);
    const userB = new helpers_1.TestBrowserSession(server);
    const userC = new helpers_1.TestBrowserSession(server);
    await Promise.all([userA, userB, userC].map(async (user) => {
        let response = await user.inject({ method: "POST", url: "/login", payload: { login: "test", password: "test" } });
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual("success");
        response = await user.inject({ method: "GET", url: "/protected" });
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual("hello!");
    }));
    const ids = await Promise.all([userA, userB, userC].map(async (user) => {
        const response = await user.inject({ method: "GET", url: "/my-id" });
        expect(response.statusCode).toEqual(200);
        return response.body;
    }));
    expect(Array.from(new Set(ids)).sort()).toEqual(ids.sort());
});
test(`logging out one user shouldn't log out the others`, async () => {
    const userA = new helpers_1.TestBrowserSession(server);
    const userB = new helpers_1.TestBrowserSession(server);
    const userC = new helpers_1.TestBrowserSession(server);
    await Promise.all([userA, userB, userC].map(async (user) => {
        let response = await user.inject({ method: "POST", url: "/login", payload: { login: "test", password: "test" } });
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual("success");
        response = await user.inject({ method: "GET", url: "/protected" });
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual("hello!");
    }));
    let response = await userB.inject({
        url: "/logout",
        method: "POST",
    });
    expect(response.statusCode).toEqual(200);
    response = await userB.inject({
        url: "/protected",
        method: "GET",
    });
    expect(response.statusCode).toEqual(401);
    await Promise.all([userA, userC].map(async (user) => {
        const response = await user.inject({ method: "GET", url: "/protected" });
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual("hello!");
    }));
});
//# sourceMappingURL=session-isolation.test.js.map