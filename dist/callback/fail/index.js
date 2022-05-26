"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class FailCallback {
    constructor() {
        this.callbacks = [];
        this.afterCallbacks = [];
    }
    run(error) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const callback of this.callbacks) {
                const result = yield callback(error);
                if (result === undefined) {
                    break;
                }
                else {
                    error = result;
                }
            }
            for (const callback of this.afterCallbacks) {
                yield callback(error);
            }
        });
    }
    add(callback) {
        this.callbacks.unshift(callback);
    }
    after(callback) {
        this.afterCallbacks.push(callback);
    }
    destroy() {
        this.callbacks = [];
        this.afterCallbacks = [];
    }
}
exports.default = FailCallback;
