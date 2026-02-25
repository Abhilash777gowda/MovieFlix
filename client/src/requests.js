const API_KEY = "92b44f51a2134bda7e85c0ff1a41de6b";
const BASE_URL = "https://api.themoviedb.org/3";

const requests = {
    // Home
    requestPopular: `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
    requestTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
    requestTrending: `${BASE_URL}/trending/all/day?api_key=${API_KEY}`,
    requestHorror: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
    requestUpcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,

    // Movies page
    requestAction: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
    requestComedy: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
    requestDrama: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=18`,
    requestSciFi: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878`,
    requestAnimation: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=16`,
    requestThriller: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=53`,

    // TV Shows page
    requestTVPopular: `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`,
    requestTVTopRated: `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
    requestTVAiringToday: `${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=en-US&page=1`,
    requestTVOnAir: `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`,
    requestTVDrama: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=18`,
    requestTVCrime: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=80`,

    // Trending page
    requestTrendingMovies: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
    requestTrendingTV: `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`,
    requestNowPlaying: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
};

export default requests;
