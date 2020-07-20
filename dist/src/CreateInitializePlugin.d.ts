/// <reference types="node" />
import Authenticator from "./Authenticator";
export declare function CreateInitializePlugin(passport: Authenticator, options?: {
    userProperty?: string;
}): import("fastify").FastifyPluginCallback<unknown, import("http").Server>;
