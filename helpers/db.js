 
const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../modules/users/users.model'),
    Aturan: require('../modules/import-data/import.model'),
    Point: require('../modules/import-data/point.model'),
    Lapor: require('../modules/lapor/lapor.model'),
    Aktivitas: require('../modules/lapor/aktivitas.model')
};