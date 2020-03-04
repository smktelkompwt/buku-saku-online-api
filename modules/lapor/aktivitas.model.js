const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        user_id: { type: String },
        nis: { type: Number },
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
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Aktivitas', schema);