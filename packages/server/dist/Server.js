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
const Express = require("express");
const DEFAULT_PORT = 3000;
class Server extends app_1.Application {
    constructor(options = {}, express = Express()) {
        super(Object.assign({ name: 'Server' }, options));
        this.express = express;
        this.options.port = options.port || DEFAULT_PORT;
    }
    onInit() {
        const _super = Object.create(null, {
            onInit: { get: () => super.onInit }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onInit.call(this);
            return new Promise((resolve, reject) => this.http = this.express
                .listen(this.options.port || DEFAULT_PORT, () => resolve())
                .on("error", (error) => reject(error)));
        });
    }
    onReady() {
        const _super = Object.create(null, {
            onReady: { get: () => super.onReady }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.onReady.call(this);
            this.logger.debug(`Express server started successfully`, { port: this.options.port });
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map