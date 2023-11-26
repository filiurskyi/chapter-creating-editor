class KeyValuePairForm {
    constructor(container, list, insertBeforeItem, id) {
        this.form = document.createElement('div');
        this.form.classList.add('key-value-pair-form');

        const text = document.createElement('p');
        text.textContent = " : ";
        this.input = document.createElement('input');
        this.input.classList.add('key-value-pair-input')
        this.input.type = 'text';
        this.input.placeholder = 'Type to search...';

        container.insertBefore(this.form, insertBeforeItem);
        this.form.appendChild(text);
        this.form.appendChild(this.input);

        this.autocompleteForm = new Form(this.form, list, text, id)
    }

    toJSON() {
        return {
            key: this.autocompleteForm,
            value: this.input.value
        };
    }
}