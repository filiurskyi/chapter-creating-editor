function fromJSONConvert(jsonData, blocks, arrows, size, container) {
    console.log(jsonData)
    jsonData.blocks.forEach(blockInfo => {
        const position = new Vector2(blockInfo.position.x, blockInfo.position.y)
        const block = new Block(position, size, container, blockInfo.id)
        block.form.input.value = blockInfo.header.input
        blockInfo.formsList.forEach(formInfo => {
            const keyValuePairForm = new KeyValuePairForm(block.docElement, fieldTypes, block.addButton, block.formsList.length)
            keyValuePairForm.keyForm.input.value = formInfo.key.input
            keyValuePairForm.valueForm.input.value = formInfo.value.input
            block.formsList.push(keyValuePairForm)
        })
        blocks.push(block)
    });

    jsonData.arrows.forEach(arrowInfo => {
        const fromBlock = getBlockById(arrowInfo.from, blocks)
        const toBlock = getBlockById(arrowInfo.to, blocks)
        const fromPoint = arrowInfo.fromTop ? fromBlock.topPoint : fromBlock.bottomPoint
        const toPoint = arrowInfo.toTop ? toBlock.topPoint : toBlock.bottomPoint

        const arrow = new Arrow(container, 2, fromBlock)
        arrow.form.input.value = arrowInfo.value.input
        arrow.setFrom(fromPoint, arrowInfo.from, arrowInfo.fromTop)
        arrow.setTo(toPoint, arrowInfo.to, arrowInfo.toTop)
        arrow.placeArrow()

        fromBlock.arrowsList.push(arrow)
        toBlock.arrowsList.push(arrow)

        arrows.push(arrow)
    });
}

function getBlockById(id, blocks) {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].id === id) {
            return blocks[i]
        }

    }
}