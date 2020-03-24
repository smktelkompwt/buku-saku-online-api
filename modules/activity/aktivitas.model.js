const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: String },
    username: { type: String },
    activity: { type: String },
    created_at: { type: String }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Aktivitas', schema);