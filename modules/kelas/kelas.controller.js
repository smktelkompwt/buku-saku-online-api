const express = require('express');
const router = express.Router();

// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');

const Kelas = db.Kelas;
const User = db.User;

// routes
router.get('/all', getAll);
router.post('/create', create);
router.get('/', getUserInClass);

module.exports = router;

async function getAll(req,res) {
    try {
        let query = await Kelas.find();
        return response.wrapper_success(res, 200, "Sukses Get All Kelas", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }   
}

async function create(req,res) {
    try {
        let model = {
            kelas: req.body.kelas,
            wali_kelas: req.body.wali_kelas
        }

        let kelas = new Kelas(model);
        let query = await kelas.save();

        return response.wrapper_success(res, 200, "Sukses Create Kelas", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                 
    }
}

async function getUserInClass(req,res) {
    try {
        let getClass = req.query.kelas;
        let checkClass = await Kelas.find({ 'kelas': getClass });

        if(!checkClass) {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Kelas tidak ditemukan')                 
        }

        let query = await User.find({ 'class': getClass, 'role': 'user' });

        return response.wrapper_success(res, 200, "Sukses Get Siswa", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                         
    }
}