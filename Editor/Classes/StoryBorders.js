let chapterBeginBlock;
let beginBlock;
let ends = new Map();

// ends.add(block, {
//     state: false,
//     endBlock: *some end block*
// })

document.addEventListener('DOMContentLoaded', () => {
    const workplace = document.getElementById('workplace');

    chapterBeginBlock = document.createElement('div');
    chapterBeginBlock.classList.add('chapter-begin-block');

    const text = document.createElement('p');
    text.textContent = "Beginning of the chapter";
    chapterBeginBlock.appendChild(text);

    workplace.appendChild(chapterBeginBlock);
});

function trySetBegin(block) {
    let hasToArrow = false;
    block.arrowsList.forEach(arrow => {
        if (arrow.toBlock === block) {
            hasToArrow = true;
            return;
        }
    });

    if (hasToArrow) return;


    if (beginBlock === undefined || beginBlock.docElement === null) {
        beginBlock = block;
    } else {
        beginBlock.arrowsList.forEach(arrow => {
            if (arrow.toBlock === beginBlock) {
                beginBlock = block;

                return;
            }
        });

        if (beginBlock !== block) {
            if (beginBlock.position.y > block.position.y) {
                beginBlock = block;
            } else if (beginBlock.position.y === block.position.y) {
                if (beginBlock.position.x < block.position.x) {
                    beginBlock = block;
                } else {
                    return;
                }
            }
            else {
                return;
            }
        }
    }

    let adjustedPosition = new Vector2(
        Math.round((beginBlock.position.x + 20) / cellSize.x) * cellSize.x,
        Math.round((beginBlock.position.y - 200) / cellSize.y) * cellSize.y
    );

    chapterBeginBlock.style.left = adjustedPosition.x + "px"
    chapterBeginBlock.style.top = adjustedPosition.y + "px"
}

function checkEnd(block) {

}