
const movies = document.querySelector('.movies')
const btnTheme = document.querySelector('.btn-theme')
const btnPrev = document.querySelector('.btn-prev')
const btnNext = document.querySelector('.btn-next')

let moviesData = [];


const api = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

async function getAllMovies() {
    try {
        const response = await api.get('/3/discover/movie?language=pt-BR&include_adult=false');
        const data = response.data.results;
        data.splice(18, 2)
        return data;
    } catch (error) {
        return error;
    }

}

async function renderMovies(moviesData) {
    moviesData = await getAllMovies();

    movies.innerHTML = '';
    moviesData.slice(0, 6).forEach(results => {
        let movie = document.createElement('div')
        movie.classList.add('movie')
        movie.style.backgroundImage = `url(${results.poster_path})`

        let movieInfo = document.createElement('div')
        movieInfo.classList.add('movie__info')

        let movieTitle = document.createElement('span')
        movieTitle.classList.add('movie__title')
        movieTitle.textContent = results.title

        let movieRating = document.createElement('span')
        movieRating.classList.add('movie__rating')
        movieRating.textContent = results.vote_average

        let img = document.createElement('img')
        img.src = './assets/estrela.svg'

        movieRating.appendChild(img)
        movieInfo.appendChild(movieTitle)
        movieInfo.appendChild(movieRating)
        movie.appendChild(movieInfo)
        movies.appendChild(movie)

        console.log(results)
    });
}

renderMovies()
