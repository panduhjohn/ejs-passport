var express = require('express');
const fetch = require('node-fetch')
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index');
});
router.get('/login', (req, res) => {
    res.render('main/login');
});
router.get('/register', (req, res) => {
    res.render('main/register');
});
router.get('/test', (req, res) => {
    res.render('test');
});

router.get('/movies', (req, res) => {
    const key = process.env.MOVIE_API;
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`;
    const img = 'https://image.tmdb.org/t/p/w500';

    fetch(url + key)
        .then(res => res.json())
        .then(data => {
            res.render('main/movies', { data, img });
        })
        .catch(err => console.log('Error in movies', err));
});

router.get('/random', (req, res) => {
    const url = 'https://randomuser.me/api/?results=20';
    fetch(url)
        .then(res => res.json())
        .then(users => {
            // const sortUsers = users.results.sort((a,b) => a + b)
            const sortUsers = users.results.sort((a, b) => {
                if (b.name.last > a.name.last) return -1;
                else if (a.name.last > b.name.last) return 1;
                else return 0;
            });
            res.render('main/random', { sortUsers });
        })
        .catch(err => console.log('Error in Random', err));
});

module.exports = router;
