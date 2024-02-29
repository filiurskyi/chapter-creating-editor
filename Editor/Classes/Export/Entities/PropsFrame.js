class PropsFrame extends Converter {
    constructor() {
        super("item");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return `"frame_type": "${this.frameType}","frame_settings": {` + this.simpleValueKeySerialization(csvFrame.formsList) + `}`;
    }
}