/// <reference types="node" />
import Authenticator from "../src/Authenticator";
import { Strategy } from "../src/strategies";
export declare class TestStrategy extends Strategy {
    authenticate(request: any, _options?: {
        pauseStream?: boolean;
    }): void;
}
export declare const getTestServer: () => import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>;
export declare const request: (options: any) => Promise<{
    response: any;
    body: any;
}>;
export declare const getConfiguredTestServer: (name?: string, strategy?: TestStrategy) => {
    fastifyPassport: Authenticator;
    server: import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>;
};
