import ComponentGroup, { ComponentGroupOptions } from "./component/ComponentGroup";
export interface ApplicationOptions extends ComponentGroupOptions {
}
export declare class Application extends ComponentGroup {
    onMount(): void;
    onInit(): Promise<void>;
    onUnmount(): void;
    onReady(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
