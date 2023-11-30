class KeyValuePairForm {
    constructor(container, listKey, listValue, insertBeforeItem, id) {
        this.form = document.createElement('div');
        this.form.classList.add('key-value-pair-form')

        container.insertBefore(this.form, insertBeforeItem);

        this.keyForm = new Form(this.form, listKey, null, id, 14)
        this.keyForm.form.style.marginRight = "40px"
        this.valueForm = new Form(this.form, listValue, null, id, 14)
        this.valueForm.form.style.marginRight = "25px"

        const background = document.createElement('div');
        background.classList.add('options')
        this.form.appendChild(background)

        const resize = document.createElement('img')
        resize.src = 'Images/resize.png'
        resize.style.maxHeight = "15px"
        resize.style.marginRight = "25px"
        background.appendChild(resize)

        const remove = document.createElement('img')
        remove.src = 'Images/cross.png'
        remove.style.maxHeight = "15px"

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