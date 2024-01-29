document.addEventListener('DOMContentLoaded', () => {
    const body = document.getElementById('customize-body-content');

    let i = 0;

    frameTypes.forEach((value, key) => {
        const div = document.createElement('div');
        div.classList.add('customize-element');
        div.classList.add(i++ % 2 == 0 ? "pair" : "odd");
        const text = document.createElement('p');
        text.textContent = key;
        div.appendChild(text);

        const image = document.createElement('img');
        image.style.backgroundColor = value;
        image.addEventListener('click', () => {

        });
        div.appendChild(image);

        body.appendChild(div);
    })
})