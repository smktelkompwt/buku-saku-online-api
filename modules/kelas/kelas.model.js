const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    kelas: { type: String },
    wali_kelas: { type: String },
    jurusan: { type: String },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Kelas', schema);