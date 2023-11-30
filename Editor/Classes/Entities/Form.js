class Form {
    constructor(container, list, insertBeforeItem, id, fontSize, method) {
        this.form = document.createElement('div');
        this.form.classList.add('autocomplete');

        this.input = document.createElement('input');
        this.input.id = 'formInput' + id;
        this.input.classList.add('formInput')
        this.input.type = 'text';
        this.input.placeholder = 'None';
        this.input.style.fontSize = fontSize + "px"

        const image = document.createElement('img');
        image.src = 'Images/tip.png';
        image.style.width = "15px"
        image.style.height = "15px"
        image.style.marginRight = "10px"
        image.style.transition = "transform ease-in-out 0.3s"
        image.style.transform = "rotate(180deg)"

        const autocompleteList = document.createElement('div');
        autocompleteList.classList.add('autocomplete-items');
        autocompleteList.id = 'autocomplete-list';

        if (insertBeforeItem)
            container.insertBefore(this.form, insertBeforeItem);
        else
            container.appendChild(this.form)

        this.form.appendChild(image);
        this.form.appendChild(this.input);
        this.form.appendChild(autocompleteList);

        this.input.addEventListener('input', () => {
            typeEvent(this.input)
        });

        this.input.addEventListener('click', () => {
            typeEvent(this.input)
        });

        function typeEvent(input) {
            input.style.borderBottom = "2px solid"
            const inputText = input.value;
            autocompleteList.innerHTML = '';
            image.style.transform = "rotate(0deg)"

            list.forEach(item => {
                if (inputText === '' || item.substr(0, inputText.length).toUpperCase() === inputText.toUpperCase()) {
                    let divElement = document.createElement('div');
                    divElement.innerHTML = inputText !== '' ? `<b>${item.substr(0, inputText.length)}</b>${item.substr(inputText.length)}` : item;
                    divElement.addEventListener('click', () => {
                        input.value = item;
                        autocompleteList.innerHTML = '';
                    });
                    autocompleteList.appendChild(divElement);
                }
            });
            if (method) method(inputText)
        }

        document.addEventListener('click', e => {
            if (e.target.id != 'formInput' + id) {
                this.input.style.borderBottom = ""
                autocompleteList.innerHTML = '';
                image.style.transform = "rotate(180deg)"
                if (method) method(this.input.value)
            }
        });
    }

    toJSON() {
        return {
            input: this.input.value
        };
    }
}