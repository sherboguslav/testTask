(function () {

    let slides = [...document.querySelectorAll('.slide')],
        current = 0;
    const
        buttons = [...document.querySelectorAll('.button')];

    load();

    function onClick(event) {
        event.preventDefault();
        const target = event.currentTarget,
            isNext = target.classList.contains('js-next');

        isNext ? current ++ : current--;

        isNext
            ? slides.forEach((slide,index) =>{
                if (index === current){
                    slide.classList.add('show');
                } else {
                    slide.classList.remove('show');
                }
            })
            : slides.forEach((slide,index) =>{
                if (index === current) {
                    slide.classList.add('show');
                }else {
                    slide.classList.remove('show');
                }
            });

        if (current === 0){
            buttons[0].disabled = true;
        } else if (current === slides.length -1){
            buttons[1].disabled = true;
        } else {
            buttons.forEach(button => button.disabled = false);
        }
    }

    function load(){
        const request = new XMLHttpRequest();
        request.open('GET','./feedback_data.json');

        request.onload = () => {
            draw(JSON.parse(request.response));
            buttons[1].disabled = false;
            slides = [...document.querySelectorAll('.slide')];
        };
        request.send();

        function draw(data) {
            const slider = document.querySelector('.wrapper');

            data.filter((slide, i) => i !==0)
                .forEach((slide,i) =>{
                    const element = document.createElement('div');
                element.classList.add('slide');
                element.innerHTML = `
                    <p class="slide__text">${slide.text}</p>
                    <p class="slide__name"><strong>${slide.name},</strong> ${slide.instagram_username}</p>
                    `;

                slider.appendChild(element);

            })
        }
    }

    buttons.forEach(button => button.addEventListener('click', onClick));
})();

(function () {
    const button = document.querySelector('.button_footer');

    function onClick(event) {
        event.preventDefault();
        const postWrapper = document.querySelector('.post');

        fetch('./blog_posts.json')
            .then(response => {
                return response.json();
            })
            .then(data => {
                data.sort((item1,item2) => {
                    return Date.parse(item2.date) - Date.parse(item1.date);
                })
                data.forEach( (item,index) => {
                    const element = document.createElement('a');
                    element.classList.add('post__item');
                    element.href = item.url;
                    element.innerHTML = `
                        <img src="./static/img/img${(index+3)%3 + 1}@2x.png" alt="" class="post__image" />
                        <div class="post__text">
                            <p>${item.title}</p>
                        </div>
                    `;
                    postWrapper.appendChild(element);
                })
                button.removeEventListener('click',onClick);
                button.remove();
            })
            .catch(error => {
                console.log(error);
            })
    }
    button.addEventListener('click', onClick);
})();
