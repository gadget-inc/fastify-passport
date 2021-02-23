import Authenticator from './Authenticator';
import { FastifyReply, FastifyRequest } from 'fastify';
declare type FlashObject = {
    type?: string;
    message?: string;
};
declare type FailureObject = {
    challenge?: string | FlashObject;
    status?: number;
    type?: string;
};
export interface AuthenticateOptions {
    scope?: string | string[];
    failureFlash?: boolean | string | FlashObject;
    failureMessage?: boolean | string;
    successRedirect?: string;
    failureRedirect?: string;
    failWithError?: boolean;
    successFlash?: boolean | string | FlashObject;
    successMessage?: boolean | string;
    assignProperty?: string;
    successReturnToOrRedirect?: string;
    authInfo?: boolean;
    session?: boolean;
}
export declare type SingleStrategyCallback = (request: FastifyRequest, reply: FastifyReply, err: null | Error, user?: unknown, info?: unknown, status?: number) => Promise<void>;
export declare type MultiStrategyCallback = (request: FastifyRequest, reply: FastifyReply, err: null | Error, user?: unknown, info?: unknown, statuses?: (number | undefined)[]) => Promise<void>;
export declare type AuthenticateCallback<Names extends string | string[]> = Names extends string ? SingleStrategyCallback : MultiStrategyCallback;
export declare class AuthenticationRoute<StrategyNames extends string | string[]> {
    readonly authenticator: Authenticator;
    readonly callback?: AuthenticateCallback<StrategyNames> | undefined;
    readonly options: AuthenticateOptions;
    readonly strategies: string[];
    readonly isMultiStrategy: boolean;
    constructor(authenticator: Authenticator, strategyOrStrategies: StrategyNames, options?: AuthenticateOptions, callback?: AuthenticateCallback<StrategyNames> | undefined);
    handler: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    attemptStrategy(failures: FailureObject[], name: string, request: FastifyRequest, reply: FastifyReply): Promise<void>;
    onAllFailed(failures: FailureObject[], request: FastifyRequest, reply: FastifyReply): Promise<void>;
    applyFlashOrMessage(event: 'success' | 'failure', request: FastifyRequest, result?: FlashObject): void;
    toFlashObject(input: string | FlashObject | undefined, type: string): FlashObject | undefined;
}
export {};
