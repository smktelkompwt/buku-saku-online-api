const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        id: { type: String },
        nis: { type: String },
        nama: { type: String },
        kelas: { type: String },
    },
    pelanggaran: {
        kategori: { type: String },
        point: { type: Number }
    },
    pelapor: {
        id: { type: String },
        nama: { type: String },
    },
    image: { type: String },
    createdDate: { type: String }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Lapor', schema);