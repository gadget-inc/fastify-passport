import { Strategy } from "../src";
export declare class TestThirdPartyStrategy extends Strategy {
    authenticate(_request: any, _options?: {
        pauseStream?: boolean;
    }): void;
}
