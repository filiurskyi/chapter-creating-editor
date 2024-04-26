class TextFrame extends Converter {
    constructor() {
        super("text");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return `"frame_type": "${this.frameType}",` + this.simpleValueKeySerialization(csvFrame.formsList);
    }
}