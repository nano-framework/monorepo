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
class ComponentGroup {
    constructor(options = {}) {
        this.options = options;
        this.logger = options.logger || errors_1.Logger.getInstance();
        this.children = options.children || this.children || [];
    }
    onMount(app) {
        this.logger.silly(`Mounting ${this.options.name} child components`, this.children.map(c => c.options.name));
        for (let i = 0; i < this.children.length; i += 1) {
            this.children[i].onMount(app);
        }
    }
    onInit(app) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.silly(`Initializing ${this.options.name} child components`, this.children.map(c => c.options.name));
            for (let i = 0; i < this.children.length; i += 1) {
                if (this.children[i].onInit) {
                    yield this.children[i].onInit(app);
                }
            }
        });
    }
    onReady(app) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.silly(`${this.options.name} components initialized successfully`, this.children.map(c => c.options.name));
            for (let i = 0; i < this.children.length; i += 1) {
                if (this.children[i].onReady) {
                    yield this.children[i].onReady(app);
                }
            }
        });
    }
    onUnmount(app) {
        this.logger.silly(`Unmounting ${this.options.name} child components`, this.children.map(c => c.options.name));
        for (let i = 0; i < this.children.length; i += 1) {
            this.children[i].onUnmount(app);
        }
    }
    components() {
        return this.children;
    }
    component(component) {
        return this.children.push(component);
    }
}
exports.default = ComponentGroup;
//# sourceMappingURL=ComponentGroup.js.map