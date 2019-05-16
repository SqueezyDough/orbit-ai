const express = require('express');
var exphbs = require('express-handlebars');
const app = express();

const port = 3000;

app
    // .use(express.static(__dirname, + '/static'))
    // .set('static', './static')
    // .get('/', function (req, res) {res.render('home');})

    .engine('handlebars', exphbs({defaultLayout: 'main'}))
    .set('view engine', 'handlebars')
    .get('/', function (req, res) {res.render('home');})

    .listen(port, () => console.log(`App listening on port ${port}!`));