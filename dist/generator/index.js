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
class PromiseGenerator {
    constructor() {
        this.beforeCallbacks = [];
    }
    set(callback) {
        this.callback = callback;
    }
    before(callback) {
        this.beforeCallbacks.push(callback);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const beforeCallback of this.beforeCallbacks) {
                yield beforeCallback();
            }
            let result;
            try {
                const data = yield this.callback();
                result = { type: 'success', data };
            }
            catch (e) {
                result = { type: 'fail', error: e };
            }
            return result;
        });
    }
    destroy() {
        this.callback = undefined;
        this.beforeCallbacks = [];
    }
}
exports.default = PromiseGenerator;
