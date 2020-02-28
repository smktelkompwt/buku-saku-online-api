const express = require('express');
const router = express.Router();

// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');

const Aturan = db.Aturan;

// routes
router.post('/all', importAll);

module.exports = router;

async function importAll(req,res) {
    try {
        let soal = require('../../data/buku-saku.json');
        let query = await Aturan.insertMany(soal);
        console.log(JSON.stringify(query[0].pasal))
        return response.wrapper_success(res, 200, "Sukses Upload Peraturan", query)
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }
    
}