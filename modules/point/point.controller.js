const express = require('express');
const router = express.Router();

// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');

const Point = db.Point;

// routes
router.get('/all', getAll);
router.get('/', getById);
router.delete('/delete', _delete);

module.exports = router;

async function getAll(req,res) {
    try {
        let query = await Point.find();
        return response.wrapper_success(res, 200, "Sukses Get Point Pelanggaran", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }
    
}

async function getById(req, res) {
    try {
        let model = {
            _id : req.query.id
        }
    
        let query = await Point.findById(model._id);
        return response.wrapper_success(res, 200, "Sukses Get Point Pelanggaran by id", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                 
    }
}

async function _delete(req, res) {
    try {
        let query = await Point.remove();
        return response.wrapper_success(res, 200, "Sukses Hapus Data Point", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                         
    }
   
}
