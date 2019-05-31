import { Application } from "../Application";
import { LoggerInstance } from "@nano/errors";
export interface ComponentOptions {
    name?: string;
}
export interface Component {
    options: ComponentOptions;
    logger: LoggerInstance;
    onMount(app: Application): void;
    onInit?(app: Application): Promise<void>;
    onUnmount(app: Application): void;
    onReady?(app: Application): Promise<void>;
}
