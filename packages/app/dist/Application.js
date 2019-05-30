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
const ComponentGroup_1 = require("./component/ComponentGroup");
class Application extends ComponentGroup_1.default {
    onMount() {
        super.onMount(this);
    }
    onInit() {
        const _super = Object.create(null, {
            onUnmount: { get: () => super.onUnmount }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onUnmount.call(this, this);
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