const express = require('express');
const routes = require('./controllers/routes.js');

const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const port = 3000;

app
    .use('/', routes)
    .use('/lib', express.static(path.join(__dirname, 'lib')))
    .set('view engine', 'handlebars')
    .engine('handlebars', exphbs({defaultLayout: 'main'}))
    .listen(port, () => console.log(`App listening on port ${port}!`));