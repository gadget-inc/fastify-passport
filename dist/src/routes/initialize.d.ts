/// <reference types="node" />
import Authenticator from "../Authenticator";
export default function initializeFactory(passport: Authenticator, options?: {
    userProperty?: string;
}): import("fastify").FastifyPluginCallback<unknown, import("http").Server>;
