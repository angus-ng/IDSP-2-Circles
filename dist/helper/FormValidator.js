"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FormValidater {
    static IsEmpty(field) {
        if (field.trim() === "") {
            return true;
        }
        return false;
    }
}
exports.default = FormValidater;
