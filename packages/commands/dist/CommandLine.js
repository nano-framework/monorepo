"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@nano/app");
const yargs = require("yargs");
exports.DEFAULT_COLUMN_WIDTH = 120;
class CommandLine extends app_1.Application {
    constructor(options = {}) {
        super(Object.assign({ name: 'nano' }, options));
        this.options.maxWidth = this.options.maxWidth || exports.DEFAULT_COLUMN_WIDTH;
    }
    onMount() {
        const maxWidth = Math.min(this.options.maxWidth, yargs.terminalWidth());
        this.yargs = yargs.usage("Usage: $0 <command> [...args]").wrap(maxWidth);
        this.yargs.scriptName(this.options.name);
        this.yargs
            .boolean("verbose")
            .alias("V", "verbose")
            .describe("verbose", "Runs command in verbose mode");
        this.yargs
            .help("h")
            .alias("h", "help")
            .alias("v", "version");
        super.onMount();
    }
    onInit() {
        const _super = Object.create(null, {
            onInit: { get: () => super.onInit }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onInit.call(this);
            console.log(' ');
            this.yargs.argv;
        });
    }
}
exports.CommandLine = CommandLine;
//# sourceMappingURL=CommandLine.js.map