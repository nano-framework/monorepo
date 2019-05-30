import { Application } from "../Application";
export interface ComponentOptions {
    name?: string;
}
export interface Component {
    options: ComponentOptions;
    onMount(app: Application): void;
    onInit?(app: Application): Promise<void>;
    onUnmount(app: Application): void;
    onReady?(app: Application): Promise<void>;
}
