class CounterFrame extends Converter {
    constructor() {
        super("counter");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return `"frame_type": "${this.frameType}",` + this.simpleValueKeySerialization(csvFrame.formsList);
    }
}