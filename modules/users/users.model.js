const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    class: { type: String },
    nis: { type: String },
    point: { type: Number },
    role: { type: String },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);