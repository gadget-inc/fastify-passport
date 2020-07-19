import { FastifyRequest } from "fastify";
export declare type DoneCallback = (err?: Error) => void;
export declare function logIn<T = unknown>(this: FastifyRequest, user: T, done: DoneCallback): void;
export declare function logIn<T = unknown>(this: FastifyRequest, user: T, options: {
    session?: boolean;
}, done?: DoneCallback): void;
