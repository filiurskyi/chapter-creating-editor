class KeyValuePairForm {
    constructor(container, listKey, insertBeforeItem, id) {
        let opened = false;
        this.form = document.createElement('div');
        this.form.classList.add('key-value-pair-form')

        this.inputEvent = () => {
            const inputText = this.keyForm.input.value;

            let list = [];
            if (fieldTypes.hasOwnProperty(inputText)) {
                list = fieldTypes[inputText];
                const isNumber = parametersList[inputText].type === ValueTypes.Integer
                this.valueForm.input.type = isNumber ? 'number' : 'text';
            }
            else {
                this.valueForm.input.type = 'text';
            }

            this.valueForm.list = list;
        }

        container.insertBefore(this.form, insertBeforeItem);

        this.keyForm = new Form(this.form, listKey, null, id, 14)
        this.keyForm.form.style.marginRight = "40px"
        this.valueForm = new Form(this.form, [], null, id, 14, this.inputEvent)
        this.valueForm.form.style.marginRight = "25px"

        const background = document.createElement('div');
        background.classList.add('options')
        this.form.appendChild(background)

        const resize = document.createElement('img')
        resize.src = 'Images/resize.png'
        resize.classList.add('resize')
        background.appendChild(resize)

        const textarea = document.createElement('textarea')
        container.appendChild(textarea)
        textarea.classList.add('textarea-display-none')

        this.keyForm.form.addEventListener('input', () => {
            this.inputEvent()
        });

        resize.addEventListener('click', (e) => {
            textarea.value = this.valueForm.input.value;
            textarea.classList.remove('textarea-display-none')

            textarea.classList.add('textarea-grow-up')
            textarea.classList.remove('textarea-grow-down')
            opened = true;
        })

        document.addEventListener('click', (e) => {
            if (e.target !== textarea && e.target !== resize) {

                if (opened)
                    this.valueForm.input.value = textarea.value

                textarea.classList.remove('textarea-grow-up')
                textarea.classList.add('textarea-grow-down')
                opened = false;
            }
        })

        const remove = document.createElement('img')
        remove.src = 'Images/cross.png'
        remove.classList.add('cross')

        background.appendChild(remove)

        remove.addEventListener('click', () => {
            this.form.remove()
        })
    }

    toJSON() {
        return {
            key: this.keyForm,
            value: this.valueForm
        };
    }
}