function fromJSONConvert(jsonData, container) {
    blocks.forEach(block => {
        block.remove();
    })

    arrows.forEach(arrow => {
        arrow.deleteArrow();
    })

    blocks = []
    arrows = []

    jsonData.blocks.forEach(blockInfo => {
        const position = new Vector2(blockInfo.position.x, blockInfo.position.y)
        const block = new Block(position, blockSize, container)
        block.header.input.textContent = blockInfo.header.input
        block.id = blockInfo.id

        blockInfo.formsList.forEach(formInfo => {
            const keyValuePairForm = new KeyValuePairForm(block, Object.keys(fieldTypes), block.addButton, block.formsList.length)
            keyValuePairForm.keyForm.input.textContent = formInfo.key.input === "" ? "None" : formInfo.key.input
            keyValuePairForm.valueForm.input.textContent = formInfo.value.input === "" ? "None" : formInfo.value.input
            block.formsList.push(keyValuePairForm)
        })

        blocks.push(block)
    });

    jsonData.arrows.forEach(arrowInfo => {
        const fromBlock = getBlockById(arrowInfo.from, blocks)
        const toBlock = getBlockById(arrowInfo.to, blocks)
        const arrow = new Arrow(container, fromBlock)
        arrow.form.input.textContent = arrowInfo.value.input === "" ? "None" : arrowInfo.value.input
        arrow.setFrom(fromBlock.bottomPoint)
        arrow.setTo(toBlock.topPoint, toBlock)
        arrow.placeArrow()

        fromBlock.arrowsList.push(arrow)
        toBlock.arrowsList.push(arrow)

        arrows.push(arrow)
    });

    // var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    // var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    // window.scrollBy(-100000, -100000);
    // window.scrollBy(blocks[0].position.x - viewportWidth / 2, blocks[0].position.y - viewportHeight / 2);
}

function getBlockById(id, blocks) {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].id === id) {
            return blocks[i]
        }
    }
}