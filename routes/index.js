const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/Users');
require('../lib/passport');

/* GET home page. */
router.get('/', (req, res) => {
    res.render('main/index');
});

router.get('/login', (req, res) => {
    res.render('main/login');
});

router.get('/register', (req, res) => {
    res.render('main/register');
});

router.post(
    '/register',
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Include a valid email').isEmail(),
        check('password', 'Include a valid password').isLength({ min: 3 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render('main/register', {
                errors: ['Name', 'Email', 'Password']
            });
        }
        const { name, email, password } = req.body;
        User.findOne({ email }).then(user => {
            if (user) {
                return console.log('User Exists');
            } else {
                const user = new User();
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(req.body.password, salt);

                user.name = name;
                user.email = email;
                user.password = hash;

                user.save()
                    .then(user => {
                        // return res
                        //     .status(200)
                        //     .json({ message: 'User Created', user });
                        return req.login(user, err => {
                            if (err) {
                                return res
                                    .status(500)
                                    .json({ message: 'Server Error', err });
                            } else {
                                return res.redirect('/');
                            }
                        });
                    })
                    .catch(err => console.log(err));
            }
        });
    }
);

router.get('/registered', (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('main/registered');
    }
    return res.redirect('/register');
});

router.post(
    '/login',
    passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

router.get('/logout', (req, res) => {
    // console.log(req.user);
    if (req.user === undefined) {
        req.flash('successMessage', 'Nobody to log out');
        return res.redirect('/');
    }
    req.logout();
    req.flash('successMessage', 'You are now logged out');
    return res.redirect('/');
});

router.get('/options', (req, res) => {
    if (req.user === undefined) {
        return res.render('main/404');
    }
    res.render('main/options');
});

router.get('/movies', (req, res) => {
    if (req.user === undefined) {
        return res.render('main/404');
    }
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
    if (req.user === undefined) {
        return res.render('main/404');
    }
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

router.get('/*', (req, res) => {
    res.render('main/404');
});

module.exports = router;
