"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
function getErrorMessage(e, def = 'unknown error') {
    return typeof e === 'string' ? e : e instanceof Error ? e.message : def;
}
exports.getErrorMessage = getErrorMessage;
