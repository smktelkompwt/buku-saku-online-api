const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const dateFormat = require('../../helpers/dateFormat');
const activity = require('../../helpers/insertActivity');

const Kelas = db.Kelas;
const User = db.User;

// routes
router.get('/all', getAll);
router.post('/create', create);
router.get('/', getUserInClass);
router.delete('/delete', _delete);

module.exports = router;

async function getAll(req,res) {
    try {
        let jurusan = req.query.jurusan;
        let query = await Kelas.find({ 'jurusan': jurusan });

                // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get All Kelas",user_id)
        return response.wrapper_success(res, 200, "Sukses Get All Kelas", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }   
}

async function create(req,res) {
    try {
        let model = {
            kelas: req.body.kelas,
            wali_kelas: req.body.wali_kelas,
            jurusan: req.body.jurusan
        }

        let checkIfExist = await Kelas.find({ 'kelas': model.kelas })
        if(checkIfExist) {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Class is already taken')
        }

        let kelas = new Kelas(model);
        let query = await kelas.save();

        // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Create Kelas",user_id)
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

        // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get User In Class",user_id)
        return response.wrapper_success(res, 200, "Sukses Get Siswa", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                         
    }
}

async function _delete(req, res) {
    try {
        let query = await Kelas.remove();

                // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Delete All Class",user_id)
        return response.wrapper_success(res, 200, "Sukses Hapus Kelas", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                         
    }
   
}
