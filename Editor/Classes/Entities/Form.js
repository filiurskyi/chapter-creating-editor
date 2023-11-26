class Form {
    constructor(container, list, insertBeforeItem, id) {
        this.form = document.createElement('div');
        this.form.classList.add('autocomplete');

        this.input = document.createElement('input');
        this.input.id = 'formInput' + id;
        this.input.classList.add('formInput')
        this.input.type = 'text';
        this.input.placeholder = 'Type to search...';

        const autocompleteList = document.createElement('div');
        autocompleteList.classList.add('autocomplete-items');
        autocompleteList.id = 'autocomplete-list';

        container.insertBefore(this.form, insertBeforeItem);
        this.form.appendChild(this.input);
        this.form.appendChild(autocompleteList);

        this.input.addEventListener('input', () => {
            const inputText = this.input.value;
            autocompleteList.innerHTML = '';

            list.forEach(item => {
                if (inputText === '' || item.substr(0, inputText.length).toUpperCase() === inputText.toUpperCase()) {
                    let divElement = document.createElement('div');
                    divElement.innerHTML = inputText !== '' ? `<strong>${item.substr(0, inputText.length)}</strong>${item.substr(inputText.length)}` : item;
                    divElement.addEventListener('click', () => {
                        this.input.value = item;
                        autocompleteList.innerHTML = '';
                    });
                    autocompleteList.appendChild(divElement);
                }
            });
        });

        this.input.addEventListener('click', () => {
            const inputText = this.input.value;
            autocompleteList.innerHTML = '';

            list.forEach(item => {
                if (inputText === '' || item.substr(0, inputText.length).toUpperCase() === inputText.toUpperCase()) {
                    let divElement = document.createElement('div');
                    divElement.innerHTML = inputText !== '' ? `<strong>${item.substr(0, inputText.length)}</strong>${item.substr(inputText.length)}` : item;
                    divElement.addEventListener('click', () => {
                        this.input.value = item;
                        autocompleteList.innerHTML = '';
                    });
                    autocompleteList.appendChild(divElement);
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (e.target.id != 'formInput' + id) {
                autocompleteList.innerHTML = '';
            }
        });
    }

    toJSON() {
        return {
            input: this.input.value
        };
    }
}