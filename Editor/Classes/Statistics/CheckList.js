let checkList = [{ state: StatState.GOOD, message: "" }]

function getCheckList(body) {
    let i = 0;

    checkList.forEach(action => {
        const element = document.createElement('div');
        element.classList.add("stat-field");
        element.classList.add(i++ % 2 === 0 ? "pair" : "odd");

        const statIcon = document.createElement('img');
        statIcon.classList.add("checklist-icon");
        switch (action.state) {
            case StatState.GOOD:
                statIcon.src = "Images/Icons/good.png";
                break;
            case StatState.WARNING:
                statIcon.src = "Images/Icons/warning.png";
                break;
            case StatState.ERROR:
                statIcon.src = "Images/Icons/error.png";
                break;
            default:
                break;
        }
        statIcon.draggable = false;
        statIcon.addEventListener('click', () => {
            switch (action.state) {
                case StatState.GOOD:
                    action.state = StatState.WARNING;
                    statIcon.src = "Images/Icons/warning.png";
                    break;
                case StatState.WARNING:
                    action.state = StatState.ERROR;
                    statIcon.src = "Images/Icons/error.png";
                    break;
                case StatState.ERROR:
                    action.state = StatState.GOOD;
                    statIcon.src = "Images/Icons/good.png";
                    break;
                default:
                    break;
            }
        })
        element.appendChild(statIcon);

        const index = i - 1;

        const message = document.createElement('input');
        message.type = "text";
        message.textContent = action.message;
        message.placeholder = "Some action to do..."
        message.value = checkList[index].message
        message.addEventListener('input', () => {
            checkList[index].message = message.value;
        })
        element.appendChild(message);

        const deleteImg = document.createElement('img');
        deleteImg.src = "Images/cross.png";
        deleteImg.draggable = false;
        deleteImg.classList.add("checklist-delete");
        deleteImg.addEventListener('click', () => {
            if (checkList.length === 1) return;

            checkList = [
                ...checkList.slice(0, index),
                ...checkList.slice(index + 1)
            ]
            body.innerHTML = '';
            getCheckList(body);
        })
        element.appendChild(deleteImg);

        const addImg = document.createElement('img');
        addImg.classList.add("checklist-add");
        addImg.src = "Images/Buttons/plus.png";
        addImg.draggable = false;
        addImg.addEventListener('click', () => {
            checkList = [
                ...checkList.slice(0, index + 1),
                { state: StatState.GOOD, message: "" },
                ...checkList.slice(index + 1)
            ]
            body.innerHTML = '';
            getCheckList(body);
        })
        element.appendChild(addImg);

        body.appendChild(element);
    });
}