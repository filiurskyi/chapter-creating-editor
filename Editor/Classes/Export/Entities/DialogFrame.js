class DialogFrame extends Converter {
    constructor() {
        super("dialog");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        const values = this.simpleValueKeySerialization(csvFrame.formsList);
        return `"frame_type": "${this.frameType}"` + values.length != 0 ? `${values.substring(0, values.length - 1)}` : "";
    }
}