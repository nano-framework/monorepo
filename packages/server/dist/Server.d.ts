/// <reference types="node" />
import { Application, ApplicationOptions } from '@nano/app';
import * as http from 'http';
export interface ServerOptions extends ApplicationOptions {
    port?: number;
}
export declare class Server extends Application {
    express: import("express-serve-static-core").Express;
    http: http.Server;
    options: ServerOptions;
    constructor(options?: ServerOptions, express?: import("express-serve-static-core").Express);
    onInit(): Promise<void>;
    onReady(): Promise<void>;
}
