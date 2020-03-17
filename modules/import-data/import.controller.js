const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const dateFormat = require('../../helpers/dateFormat');
const activity = require('../../helpers/insertActivity');

const Aturan = db.Aturan;
const Point = db.Point;

// routes
router.post('/peraturan', importPeraturan);
router.post('/point', importPoint);

module.exports = router;

async function importPeraturan(req,res) {
    try {
        let soal = require('../../data/buku-saku.json');
        let query = await Aturan.insertMany(soal);

        // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Import Peraturan",user_id)
        return response.wrapper_success(res, 200, "Sukses Upload Peraturan", query)
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }
}

async function importPoint(req,res) {
    try {
        let point = require('../../data/daftar-point.json');
        let query = await Point.insertMany(point);
                // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Import Point",user_id)
        return response.wrapper_success(res, 200, "Sukses Upload Point", query)
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }
}