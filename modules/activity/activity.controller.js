const express = require('express');
const router = express.Router();

// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');

const Aktivitas = db.Aktivitas;

// routes
router.get('/all', getAll);
router.delete('/delete', _delete);

module.exports = router;

async function getAll(req,res) {
    try {
        let query = await Aktivitas.find().limit(10).sort({ "created_at": -1});
        return response.wrapper_success(res, 200, "Sukses Get All Aktivitas", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }
}

async function _delete(req, res) {
    try {
        let query = await Aktivitas.remove();
        return response.wrapper_success(res, 200, "Sukses Hapus Peraturan", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                         
    }
   
}