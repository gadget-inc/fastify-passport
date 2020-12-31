/// <reference types="node" />
import Authenticator from './Authenticator';
export declare function CreateInitializePlugin(passport: Authenticator, options?: {
    userProperty?: string;
}): import("fastify").FastifyPluginAsync<unknown, import("http").Server>;
