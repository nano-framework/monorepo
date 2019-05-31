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
const errors_1 = require("@nano/errors");
const ComponentGroup_1 = require("./component/ComponentGroup");
class Application extends ComponentGroup_1.default {
    constructor(options = {}) {
        const logger = options.logger || errors_1.Logger.initialize();
        super(Object.assign({ name: 'Application', logger }, options));
    }
    onMount() {
        super.onMount(this);
    }
    onInit() {
        const _super = Object.create(null, {
            onInit: { get: () => super.onInit }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onInit.call(this, this);
        });
    }
    onUnmount() {
        super.onUnmount(this);
    }
    onReady() {
        const _super = Object.create(null, {
            onReady: { get: () => super.onReady }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onReady.call(this, this);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.onMount();
            yield this.onInit();
            yield this.onReady();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.onUnmount();
        });
    }
}
exports.Application = Application;
//# sourceMappingURL=Application.js.map