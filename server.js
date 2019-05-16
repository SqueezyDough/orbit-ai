const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const port = 3000;

app
    .use('/lib', express.static(path.join(__dirname, 'lib')))

    .set('view engine', 'handlebars')
    .engine('handlebars', exphbs({defaultLayout: 'main'}))

    .get('/', function (req, res) {
        res.render('home', {
            title: 'Home'
        });
    })

    .listen(port, () => console.log(`App listening on port ${port}!`));