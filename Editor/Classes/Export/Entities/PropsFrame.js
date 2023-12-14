class PropsFrame extends Converter {
    constructor() {
        super("item");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return `"frame_type": "${this.frameType}",` + this.simpleValueKeySerialization(csvFrame.formsList);
    }
}