class Form {
    constructor(container, list, insertBeforeItem, id, fontSize, method = null) {
        this.form = document.createElement('div');
        this.form.classList.add('autocomplete');

        this.input = document.createElement('input');
        this.input.id = 'formInput' + id;
        this.input.classList.add('formInput')
        this.input.type = 'text';
        this.input.placeholder = 'None';
        this.input.style.fontSize = fontSize + "px"

        this.image = document.createElement('img');
        this.image.src = 'Images/tip.png';
        this.image.style.width = "15px"
        this.image.style.height = "15px"
        this.image.style.marginRight = "10px"
        this.image.style.transition = "transform ease-in-out 0.3s"
        this.image.style.transform = "rotate(180deg)"

        this.autocompleteList = document.createElement('div');
        this.autocompleteList.classList.add('autocomplete-items');
        this.autocompleteList.id = 'autocomplete-list';

        this.list = list;

        if (insertBeforeItem)
            container.insertBefore(this.form, insertBeforeItem);
        else
            container.appendChild(this.form)

        this.form.appendChild(this.image);
        this.form.appendChild(this.input);
        this.form.appendChild(this.autocompleteList);

        this.input.addEventListener('input', () => {
            this.typeEvent(this.input)
        });

        this.input.addEventListener('click', () => {
            this.typeEvent(this.input)
        });

        document.addEventListener('click', e => {
            if (e.target.id != 'formInput' + id) {
                this.input.style.borderBottom = ""
                this.autocompleteList.innerHTML = '';
                this.image.style.transform = "rotate(180deg)"
                if (method) method(this.input.value)
            }
        });

        this.method = method;

        this.autocompleteList.addEventListener('wheel', function (e) {
            if ((this.scrollHeight - this.scrollTop <= this.clientHeight && e.deltaY > 0) || (this.scrollTop === 0 && e.deltaY < 0)) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    typeEvent(input) {
        input.style.borderBottom = "2px solid"
        const inputText = input.value;
        this.autocompleteList.innerHTML = '';
        this.image.style.transform = "rotate(0deg)"

        this.list.forEach(item => {
            if (inputText === '' || item.substr(0, inputText.length).toUpperCase() === inputText.toUpperCase()) {
                let divElement = document.createElement('div');
                scrollable.push(divElement)
                divElement.innerHTML = inputText !== '' ? `<b>${item.substr(0, inputText.length)}</b>${item.substr(inputText.length)}` : item;
                divElement.addEventListener('click', () => {
                    input.value = item;
                    this.autocompleteList.innerHTML = '';
                    if (this.method !== null) {
                        this.method(item)
                    }
                });
                this.autocompleteList.appendChild(divElement);
            }
        });
        if (this.method !== null) {
            this.method(inputText)
        }
    }

    toJSON() {
        return {
            input: this.input.value
        };
    }
}