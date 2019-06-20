const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=9379e25f2a62bb9db34f96b00d200699&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка...';
    requestApi(server)
        .then(function (result) {
            const output = JSON.parse(result);
            let inner = '';
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let poster = 'https://image.tmdb.org/t/p/w300' + item.poster_path || item.backdrop_path;
                let date = item.first_air_date || item.release_date;
                inner += '<div class="col-12 col-md-4 col-xl-3"><h3>' + nameItem + '</h3>' + '<img src=' + poster + '>' + '<p>Дата выхода: ' + date + '</p>' + '</div>';
            });
            movie.innerHTML = inner;
        })
        .catch(function(reason){
            movie.innerHTML = "Упс, что-то пошло не так!";
            console.log('error:' + reason.status);
        });
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
    return new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.addEventListener('load', function () {
            console.log('error');
            if (request.status !== 200) {
                reject({
                    status: request.status
                });
                return;
            }
            resolve(request.response);
        });

        request.addEventListener('error', function () {
            reject({
                status: request.status
            });
        });
        request.send(); //ждем ответ от сервера
    });
}