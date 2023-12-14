function fromJSONConvert(jsonData, blocks, arrows, size, container) {
    blocks.forEach(block => {
        block.remove()
    })

    arrows.forEach(arrow => {
        arrow.deleteArrow()
    })

    scale = jsonData.scale;
    recalculateDots();

    jsonData.blocks.forEach(blockInfo => {
        const position = new Vector2(blockInfo.position.x, blockInfo.position.y)
        const block = new Block(position, size, container)
        block.header.input.value = blockInfo.header.input
        block.id = blockInfo.id

        blockInfo.formsList.forEach(formInfo => {
            const keyValuePairForm = new KeyValuePairForm(block.docElement, fieldTypes, fieldTypes, block.addButton, block.formsList.length)
            keyValuePairForm.keyForm.input.value = formInfo.key.input
            keyValuePairForm.valueForm.input.value = formInfo.value.input
            block.formsList.push(keyValuePairForm)
        })

        blocks.push(block)
    });

    jsonData.arrows.forEach(arrowInfo => {
        const fromBlock = getBlockById(arrowInfo.from, blocks)
        const toBlock = getBlockById(arrowInfo.to, blocks)
        const arrow = new Arrow(container, fromBlock)
        arrow.form.input.value = arrowInfo.value.input
        arrow.setFrom(fromBlock.bottomPoint)
        arrow.setTo(toBlock.topPoint, toBlock)
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