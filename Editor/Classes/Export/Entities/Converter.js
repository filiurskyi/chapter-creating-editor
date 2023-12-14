class Converter {
    constructor(frameType) {
        this._frameType = frameType;
        this.additionInformation = null;
    }

    get frameType() {
        return this._frameType;
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        throw new Error("Method 'convertToJSON' must be implemented.");
    }

    simpleValueKeySerialization(fields) {
        let json = "";
        for (let field of fields) {
            let [key, type, isFounded] = tryGetParameterPair(field.key.input, field.value.input);
            if (isFounded) {
                json += `"${key}":${type},`;
            }
        }
        return json.length > 0 ? json.substring(0, json.length - 1) : json;
    }
}