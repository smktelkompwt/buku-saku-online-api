const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    kode: { type: String },
    jenis_pelanggaran: { type: String },
    point: { type: Number }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Point', schema);