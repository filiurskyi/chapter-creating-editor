class DialogFrame extends Converter {
    constructor() {
        super("dialog");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return `"frame_type": "${this.frameType}",` + this.simpleValueKeySerialization(csvFrame.formsList);
    }
}