const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    if (searchText.trim().length === 0) {
        movie.innerHTML = `<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>`;
        return;
    }
    movie.innerHTML = '<div class="spinner"></div>';
    fetch('https://api.themoviedb.org/3/search/multi?api_key=9379e25f2a62bb9db34f96b00d200699&language=ru&query=' + searchText)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function (output) {
            let inner = '';
            if (output.results.length === 0) {
                inner = `<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>`;
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let date = item.first_air_date || item.release_date;
                /*let originalTitle = item.original_name || item.original_title;
                originalTitle = originalTitle.toLowerCase();
                originalTitle = originalTitle.replace(/ /g, "-");*/
                let mediaType = item.media_type;
                let poster;
                if (item.poster_path !== null) {
                    poster = 'https://image.tmdb.org/t/p/original' + item.poster_path;

                } else {
                    poster = './noPoster.png';
                }
                /*
                <a target='_blank' href='https://www.themoviedb.org/${mediaType}/${item.id}-${originalTitle}'>*/
                let dataInfo = '';
                if (item.media_type !== 'person') dataInfo = `data-id='${item.id}' data-type='${item.media_type}'`;
                inner += `<div class="col-12 col-md-6 col-xl-3 item">
                <h5>${nameItem}</h5>
                <img src='${poster}'class="img_poster" alt='${nameItem}' ${dataInfo}>
                <p>Дата выхода:${date}</p>
                </div>`;
            });
            movie.innerHTML = inner;

            addEventMedia();

        })
        .catch(function (reason) {
            movie.innerHTML = "Упс, что-то пошло не так!";
            console.error(reason);
        });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
    const media = movie.querySelectorAll("img[data-id]");
    media.forEach(function (elem) {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    });
}

function showFullInfo() {
    //  console.log(this.dataset.type);
    let url = '';
    if (this.dataset.type === 'movie') {
        url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=9379e25f2a62bb9db34f96b00d200699&language=ru
      `;
    } else if (this.dataset.type === 'tv') {
        url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=9379e25f2a62bb9db34f96b00d200699&language=ru
      `;
    } else {
        movie.innerHTML = `<h2 class="col-12 text-center text-danger">Всё очень плохо...</h2>`;
        return;
    }


    fetch(url)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function (output) {
            console.log(output);
            let poster;
            if (output.poster_path !== null) {
                poster = 'https://image.tmdb.org/t/p/original' + output.poster_path;

            } else {
                poster = './noPoster.png';
            }
            movie.innerHTML = `
            <h4 class="col-12 text-center text-info">${output.name||output.title}</h4>
            <div class="col-4">
            <img src='${poster}'class="img_poster" alt='${output.name || output.title}'>
            ${(output.homepage?`<p class='text-center'><a href="${output.homepage}" target='_blank'> Официальная страница</a></p>`:'')}
            ${(output.imdb_id?`<p class='text-center'><a href="https://imdb.com/title/${output.imdb_id}" target='_blank'> Страница на IMDB.com</a></p>`:'')}
            </div>
            <div class="col-8">
            <p>Рейтинг: ${output.vote_average}</p>
            <p>Статус: ${output.status}</p>
            <p>Премьера: ${output.release_date||output.first_air_date}</p>
            
            ${(output.last_episode_to_air)?`<p>${output.number_of_seasons} сезон, ${output.last_episode_to_air.episode_number} серий вышло</p>`:''}

            
            <p>Описание: ${output.overview}</p>
            </div>
            `;
        })
        .catch(function (reason) {
            movie.innerHTML = "Упс, что-то пошло не так!";
            console.error(reason);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://api.themoviedb.org/3/trending/all/day?api_key=9379e25f2a62bb9db34f96b00d200699&language=ru')
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function (output) {
            let inner = `<h4 class="col-12 text-center text-info">Популярные за неделю</h4>`;
            if (output.results.length === 0) {
                inner = `<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>`;
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let date = item.first_air_date || item.release_date;
                let mediaType = item.title ? 'movie' : 'tv';
                let poster;
                if (item.poster_path !== null) {
                    poster = 'https://image.tmdb.org/t/p/original' + item.poster_path;

                } else {
                    poster = './noPoster.png';
                }
                let dataInfo = `data-id='${item.id}' data-type='${mediaType}'`;
                inner += `<div class="col-12 col-md-6 col-xl-3 item">
                <h5>${nameItem}</h5>
                <img src='${poster}'class="img_poster" alt='${nameItem}' ${dataInfo}>
                <p>Дата выхода:${date}</p>
                </div>`;
            });
            movie.innerHTML = inner;

            addEventMedia();

        })
        .catch(function (reason) {
            movie.innerHTML = "Упс, что-то пошло не так!";
            console.error(reason);
        });
})