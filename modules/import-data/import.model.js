const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    bab: { type: String },
    pasal: [
        {
            title: { type: String},
            desc: [
                {
                    id: { type: Number },
                    descPasal: { type: String}
                }
            ]
        }
    ]
    
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Aturan', schema);