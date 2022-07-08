"use strict";
class Sanitizer {

    #possibleTypes = ["text"];
    #type = null;

    constructor(type) {
        if (this.#possibleTypes.includes(type)) {
            this.#type = type;
            console.log(`Type ${this.#type} is a valid type.`);
        } else {
            this.#type = undefined;
            let err = `Type ${this.#type} is not a valid type!`;
            console.error(err);
            return err;
        }
    }

    sanitize(value) {
        switch (this.#type) {
            case "text":
                return this._SanitizeText(value);
            default:
                return value;
        }
    }

    _SanitizeText(text) {
        let escapeTokens = [
            {"token": "&", "escaped": "&amp;"},
            {"token": '"', "escaped": "&quot;"},
            {"token": "'", "escaped": "&apos;"},
            {"token": ">", "escaped": "&gt;"},
            {"token": "<", "escaped": "&lt;"}
        ];
        let sanitizedText = text;
        for (const tokenObj of escapeTokens) {
            sanitizedText = sanitizedText.replaceAll(tokenObj.token, tokenObj.escaped);
        }
        return sanitizedText;
    }

}