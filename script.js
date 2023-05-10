
const api = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

async function getData() {
    const response = await api.get('/3/discover/movie?language=pt-BR&include_adult=false');
    const data = response.data.results;
    return data;
}

const movies = document.querySelector('.movies')
const btnTheme = document.querySelector('.btn-theme')
const btnPrev = document.querySelector('.btn-prev')
const btnNext = document.querySelector('.btn-next')