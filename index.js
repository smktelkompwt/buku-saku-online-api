require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('helpers/jwt');
const errorHandler = require('helpers/error-handler');

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes


app.get('/', function (req, res) {
    res.json({
        status: 200,
        message: 'Service is successfull running :D'
    });
});

app.use('/api/users', require('./modules/users/users.controller'));
app.use('/api/import', require('./modules/import-data/import.controller'));
app.use('/api/peraturan', require('./modules/peraturan/peraturan.controller'));
app.use('/api/point', require('./modules/point/point.controller'));
app.use('/api/lapor', require('./modules/lapor/lapor.controller'));
app.use('/api/kelas', require('./modules/kelas/kelas.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8080;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});