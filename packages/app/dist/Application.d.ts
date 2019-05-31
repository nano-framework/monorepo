import { LoggerInstance } from '@nano/errors';
import ComponentGroup, { ComponentGroupOptions } from "./component/ComponentGroup";
export interface ApplicationOptions extends ComponentGroupOptions {
    logger?: LoggerInstance;
}
export declare class Application extends ComponentGroup {
    readonly options: ApplicationOptions;
    constructor(options?: ApplicationOptions);
    onMount(): void;
    onInit(): Promise<void>;
    onUnmount(): void;
    onReady(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
