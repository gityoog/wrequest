"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WRequestOriginError = exports.WRequestError = exports.getErrorMessage = void 0;
function getErrorMessage(e, def = 'unknown error') {
    return typeof e === 'string' ? e : e instanceof Error ? e.message : def;
}
exports.getErrorMessage = getErrorMessage;
/**@deprecated */
class WRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.WRequestError = WRequestError;
class WRequestOriginError extends WRequestError {
    constructor({ message, code, data }) {
        super(message);
        this.code = code;
        this.data = data;
    }
}
exports.WRequestOriginError = WRequestOriginError;
