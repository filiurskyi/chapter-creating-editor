class ChoiceByChoiceFrame extends Converter {
    constructor() {
        super("choice-by-choice");
        this.choiceCount = 0;
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return `"frame_type": "choice-by-choice",` +
            this.choiceValueKeySerialization(index, jsonGenerator.BannedIndexes, jsonGenerator);
    }

    choiceValueKeySerialization(index, bannedIndexes, jsonGenerator) {
        const idPart = "chapter" + jsonGenerator.ChapterIndex + "_choice_by_choice" + this.choiceCount + "_answer";
        let json = "\"frame_id_part\": \"" + idPart + "\",";

        bannedIndexes.add(index);

        let variantCount = 1;

        const duplicates = getDublicateSourceToSource(jsonGenerator.Arrows, [index, 0]);

        for (let i = 0; i < duplicates.length; i++) {
            let jsonFrame;

            if (duplicates[i].from in jsonGenerator.JSONFrames) {
                jsonFrame = jsonGenerator.JSONFrames[duplicates[i].from];
            } else {
                jsonFrame = new JSONFrame(duplicates[i].from);
                jsonGenerator.JSONFrames[duplicates[i].from] = jsonFrame;
            }

            if (duplicates[i].value.input == "cbc") {
                json += "\"choice_id\": \"" + jsonFrame.additionInformation + "\",";
                variantCount--;
                continue;
            }

            variantCount++;

            jsonFrame.frameID = idPart + variantCount;
        }

        _choiceCount++;
        return json.Substring(0, json.Length - 1);
    }


}