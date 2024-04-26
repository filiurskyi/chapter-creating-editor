class LegacyChoiceFrame extends Converter {
    constructor() {
        super("legacy choice");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return `"frame_type": "${this.frameType}",` + this.simpleValueKeySerialization(csvFrame.formsList);
    }
}