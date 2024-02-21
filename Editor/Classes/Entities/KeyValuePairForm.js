class KeyValuePairForm {
    constructor(block, listKey, insertBeforeItem, id) {
        let opened = false;
        this.form = document.createElement('div');
        this.form.classList.add('key-value-pair-form')

        this.inputEvent = (value) => {
            const inputText = this.keyForm.input.textContent;

            let list = [];
            if (fieldTypes.hasOwnProperty(inputText)) {
                list = fieldTypes[inputText];
            }

            this.valueForm.list = list;

            setAvatarImage();
            isPremium();
            isComment();

            block.updateArrows();
        }

        block.docElement.insertBefore(this.form, insertBeforeItem);

        this.keyForm = new Form(this.form, listKey, null, id, 14)
        this.keyForm.form.style.marginRight = "50px"
        this.valueForm = new Form(this.form, [], null, id, 14, this.inputEvent)

        const background = document.createElement('div');
        background.classList.add('options')
        this.form.appendChild(background)

        const resize = document.createElement('img')
        resize.src = 'Images/resize.png'
        resize.classList.add('resize')
        resize.draggable = false
        background.appendChild(resize)

        const textarea = document.createElement('textarea')
        block.docElement.appendChild(textarea)
        textarea.classList.add('textarea-display-none')

        this.keyForm.form.addEventListener('input', () => {
            this.inputEvent()
        });

        resize.addEventListener('click', (e) => {
            textarea.value = this.valueForm.input.textContent;
            textarea.classList.remove('textarea-display-none')

            textarea.classList.add('textarea-grow-up')
            textarea.classList.remove('textarea-grow-down')
            opened = true;
        })

        document.addEventListener('click', (e) => {
            if (e.target !== textarea && e.target !== resize) {

                if (opened)
                    this.valueForm.input.textContent = textarea.value

                textarea.classList.remove('textarea-grow-up')
                textarea.classList.add('textarea-grow-down')
                opened = false;
            }
        })

        const remove = document.createElement('img')
        remove.src = 'Images/cross.png'
        remove.classList.add('cross')
        remove.draggable = false

        background.appendChild(remove)

        remove.addEventListener('click', () => {
            block.formsList = block.formsList.filter(item => item !== this)
            setAvatarImage();
            isPremium();
            isComment();
            this.form.remove();

            updateEnd(block);
        })

        const setAvatarImage = () => {
            block.avatarPlaceholder.style.display = "none";
            block.formsList.forEach(f => {
                if (f.keyForm.input.textContent === 'character') {
                    if (characterImages.hasOwnProperty(f.valueForm.input.textContent)) {
                        if (characterImages[f.valueForm.input.textContent] !== "") {
                            block.avatarPlaceholder.style.display = "block";
                            block.avatarPlaceholder.src = characterImages[f.valueForm.input.textContent];
                        }
                    }
                }
            });
        }

        const isPremium = () => {
            let isPremium = false;
            const link = "Images/Icons/premium.png";

            block.formsList.forEach(f => {
                if (f.keyForm.input.textContent === 'premium') {
                    if (f.valueForm.input.textContent === 'true') {
                        isPremium = true;
                    }
                }
            });

            isPremium ? block.addIcon(link) : block.removeIcons(link);
        };

        const isComment = () => {
            let isComment = false;
            const link = "Images/Icons/chat.png";

            block.formsList.forEach(f => {
                if (f.keyForm.input.textContent === 'comment') {
                    isComment = true;
                }
            });

            isComment ? block.addIcon(link) : block.removeIcons(link);
        };
    }

    toJSON() {
        return {
            key: this.keyForm,
            value: this.valueForm
        };
    }
}