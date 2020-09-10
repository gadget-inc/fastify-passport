/// <reference types="node" />
/// <reference types="node/ts3.1/http" />
/// <reference types="got/dist/source/core/utils/timed-out" />
import Authenticator from './Authenticator';
export declare function CreateInitializePlugin(passport: Authenticator, options?: {
    userProperty?: string;
}): import("fastify").FastifyPluginAsync<unknown, import("http").Server>;
