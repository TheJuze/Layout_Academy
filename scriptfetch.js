const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=9379e25f2a62bb9db34f96b00d200699&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка...';
    fetch(server)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function (output) {
            let inner = '';
            output.results.forEach(function (item) {
                console.log(item);
                let nameItem = item.name || item.title;
                let date = item.first_air_date || item.release_date;
                let originalTitle = item.original_name || item.original_title;
                originalTitle = originalTitle.toLowerCase();
                originalTitle = originalTitle.replace(/ /g, "-");
                let mediaType = item.media_type;
                if (item.poster_path !== null) {
                    let poster = 'https://image.tmdb.org/t/p/original' + item.poster_path;
                    inner += `<div class="col-12 col-md-4 col-xl-3">
                <h5>${nameItem}</h5>
                <a href='https://www.themoviedb.org/${mediaType}/${item.id}-${originalTitle}'>
                <img src='${poster}' alt='${nameItem}'>
                </a>
                <p>Дата выхода:${date}</p>
                </div>`;
                } else {
                    let poster = './noPoster.png';
                    inner += `<div class="col-12 col-md-4 col-xl-3">
                <h5>${nameItem}</h5>
                <a href='https://www.themoviedb.org/${mediaType}/${item.id}-${originalTitle}'>
                <img src='${poster}' alt='${nameItem}'>
                </a>
                <p>Дата выхода:${date}</p>
                </div>`;
                }
            });
            movie.innerHTML = inner;
        })
        .catch(function (reason) {
            movie.innerHTML = "Упс, что-то пошло не так!";
            console.error(reason);
        });
}

searchForm.addEventListener('submit', apiSearch);