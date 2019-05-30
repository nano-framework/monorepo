import { ComponentOptions, Component } from './Component';
import { Application } from '../Application';
export interface ComponentGroupOptions extends ComponentOptions {
    children?: Component[];
}
export default abstract class ComponentGroup implements Component {
    options: ComponentGroupOptions;
    children: Component[];
    constructor(options?: ComponentGroupOptions);
    onMount(app: Application): void;
    onInit(app: Application): Promise<void>;
    onReady(app: Application): Promise<void>;
    onUnmount(app: Application): void;
    components(): Component[];
    component(component: Component): number;
}
