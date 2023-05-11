
const movies = document.querySelector('.movies');
const btnTheme = document.querySelector('.btn-theme');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const input = document.querySelector('.input');
const modal = document.querySelector('.modal', '.hidden');


let page = 0;
let search = false;
let searchData = [];


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

async function renderMovies() {
    moviesData = search && searchData.length ? searchData : await getAllMovies();

    movies.innerHTML = '';
    moviesData.slice(page, page + 6).forEach(results => {
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


        movie.addEventListener('click', async () => await movieModal(results.id));
    });
}

renderMovies()

btnNext.addEventListener('click', () => {
    if (page === 12) {
        page = 0
    } else {
        page += 6
    }
    renderMovies();
})

btnPrev.addEventListener('click', () => {
    if (page === 0) {
        page = 12
    } else {
        page -= 6
    }
    renderMovies();
})

async function searchMovie(e) {
    const response = await api.get(`/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`);
    const movies = response.data;

    if (e.key !== 'Enter') {
        return;
    }

    searchData = movies.results;
    search = true;

    page = 0;
    input.value = '';
    renderMovies();
}

input.addEventListener('keypress', searchMovie);

async function dayMovie() {
    const endpointGeral = await api.get('/3/movie/436969?language=pt-BR');
    const endpointVideo = await api.get('/3/movie/436969/videos?language=pt-BR');

    let highLightVideoLink = document.querySelector('.highlight__video-link')
    highLightVideoLink.setAttribute('href', `https://www.youtube.com/watch?v=${endpointVideo.data.results[0].key}`);

    let highLightPicture = endpointGeral.data.backdrop_path;

    let highLightVideo = document.querySelector('.highlight__video');
    highLightVideo.style.backgroundImage = `url(${highLightPicture})`;
    highLightVideo.style.backgroundSize = 'contain';

    let highLightTitle = document.querySelector('.highlight__title');
    highLightTitle.textContent = endpointGeral.data.title;

    let highLightRating = document.querySelector('.highlight__rating');
    highLightRating.textContent = endpointGeral.data.vote_average;

    let highLightGenres = document.querySelector('.highlight__genres');
    highLightGenres.textContent = endpointGeral.data.genres.map(genre => genre.name).join(', ')

    const currentDate = new Date(endpointGeral.data.release_date);
    const formatDate = currentDate.toLocaleDateString("pt-BR", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });

    let highLightLaunch = document.querySelector('.highlight__launch');
    highLightLaunch.textContent = formatDate;

    let highLightDescription = document.querySelector('.highlight__description');
    highLightDescription.textContent = endpointGeral.data.overview;

}
dayMovie()


async function movieModal(movieId) {
    modal.classList.remove('hidden');
    console.log(movieId)
    const movieApi = await api.get(`/3/movie/${movieId}?language=pt-BR`);


    let modalTitle = document.querySelector('.modal__title');
    modalTitle.textContent = movieApi.data.title;

    let modalImg = document.querySelector('.modal__img');
    modalImg.src = movieApi.data.backdrop_path;

    let modalDescription = document.querySelector('.modal__description');
    modalDescription.textContent = movieApi.data.overview;

    let modalAverage = document.querySelector('.modal__average');
    modalAverage.textContent = movieApi.data.vote_average;

    let modalGenres = document.querySelector('.modal__genres');
    const modalDate = movieApi.data.genres;

    modalGenres.innerHTML = '';

    modalDate.forEach((genre) => {
        const modalSpan = document.createElement('span');
        modalSpan.classList.add('modal__genre');
        modalSpan.textContent = genre.name;
        modalGenres.appendChild(modalSpan);
    })
};


modal.addEventListener('click', () => {
    modal.classList.add('hidden');
});