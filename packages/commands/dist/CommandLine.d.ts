import { Application, ApplicationOptions } from '@nano/app';
import * as yargs from "yargs";
export declare const DEFAULT_COLUMN_WIDTH = 120;
export interface CommandLineOptions extends ApplicationOptions {
    maxWidth?: number;
}
export declare class CommandLine extends Application {
    yargs: yargs.Argv;
    options: CommandLineOptions;
    constructor(options?: CommandLineOptions);
    onMount(): void;
    onInit(): Promise<void>;
}
