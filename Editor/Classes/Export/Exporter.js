function exportToJSON() {
    let data = {
        blocks: blocks,
        arrows: arrows,
    };

    const jsonString = JSON.stringify(data);
    const parsedData = JSON.parse(jsonString);

    parsedData.arrows.sort((a, b) => {
        if (a.from < b.from) {
            return -1;
        }
        if (a.from > b.from) {
            return 1;
        }
        return 0;
    });

    let _visited = [];

    function getSortedArrowsIndexes(arrow, neededIndex = null) {
        let part = [];

        if (arrow === null) {
            if (neededIndex !== null) {
                part.push(neededIndex);
                _visited.push(neededIndex);
            }
            return part;
        }

        if (_visited.includes(arrow.from)) return part;

        part.push(arrow.from);
        _visited.push(arrow.from);

        let list = getDuplicateSourceToSource(parsedData.arrows, arrow);

        if (list.length === 0) return part;

        let sorted = [];
        for (let i = list.length - 1; i >= 0; i--) {
            sorted.push(getSortedArrowsIndexes(
                _arrows.find(item => item.from === list[i].to), list[i].to));
        }

        let duplicateJoin = [];
        for (let i = 0; i < sorted.length; i++) {
            for (let j = sorted[i].length - 1; j >= 0; j--) {
                if (!duplicateJoin.includes(sorted[i][j])) {
                    duplicateJoin.push(sorted[i][j]);
                }
            }
        }

        duplicateJoin.reverse();
        part = part.concat(duplicateJoin);

        return part;
    }

    console.log(getSortedArrowsIndexes());
}

const Type = {
    Source: 'Source',
    Destination: 'Destination'
};

function getDuplicateSourceToSource(arrowsList, arrow) {
    return getDuplicate(arrowsList, arrow, Type.Source, Type.Source);
}

function getDuplicate(arrowsList, arrow, type1, type2) {
    let duplicateArrows = [];

    arrowsList.forEach(v => {
        let value1 = type1 === Type.Source ? v.source : v.destination;
        let value2 = type2 === Type.Source ? arrow.source : arrow.destination;
        if (value1 === value2) {
            duplicateArrows.push(v);
        }
    });

    return duplicateArrows;
}
