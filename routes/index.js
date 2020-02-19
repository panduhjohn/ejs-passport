var express = require('express');
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

module.exports = router;
