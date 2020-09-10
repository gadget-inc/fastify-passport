/// <reference types="node" />
/// <reference types="node/ts3.1/http" />
/// <reference types="got/dist/source/core/utils/timed-out" />
import { FastifyInstance } from 'fastify';
import Authenticator from '../src/Authenticator';
import { Strategy } from '../src/strategies';
import { InjectOptions, Response as LightMyRequestResponse } from 'light-my-request';
export declare const generateTestUser: () => {
    name: string;
    id: string;
};
export declare class TestStrategy extends Strategy {
    authenticate(request: any, _options?: {
        pauseStream?: boolean;
    }): void;
}
export declare class TestBrowserSession {
    readonly server: FastifyInstance;
    cookies: Record<string, string>;
    constructor(server: FastifyInstance);
    inject(opts: InjectOptions): Promise<LightMyRequestResponse>;
}
export declare const getTestServer: () => FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance> & PromiseLike<FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>>;
export declare const getConfiguredTestServer: (name?: string, strategy?: TestStrategy) => {
    fastifyPassport: Authenticator;
    server: FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance> & PromiseLike<FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>>;
};
