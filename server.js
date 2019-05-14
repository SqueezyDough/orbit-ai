const express = require('express');
var exphbs = require('express-handlebars');
const app = express();

const port = 3000;

app
    .engine('handlebars', exphbs({defaultLayout: 'main'}))
    .set('view engine', 'handlebars')
    .get('/', function (req, res) {res.render('home');})

    .listen(port, () => console.log(`App listening on port ${port}!`));
