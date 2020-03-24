const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const activity = require('../../helpers/insertActivity');

const Kelas = db.Kelas;
const User = db.User;

// routes
router.get('/all', getAll);
router.post('/create', createKelas);
router.get('/', getUserInClass);
router.delete('/delete', _delete);
router.delete('/remove', deleteKelasbyId);
router.put('/edit', editKelas)

module.exports = router;

async function getAll(req,res) {
    try {
        let jurusan = req.query.jurusan;
        let query = await Kelas.find({ 'jurusan': jurusan });

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get All Kelas",user_id)
        return response.wrapper_success(res, 200, "Sukses Get All Kelas", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }   
}

async function createKelas(req,res) {
    try {
        let model = {
            kelas: req.body.kelas,
            wali_kelas: req.body.wali_kelas,
            jurusan: req.body.jurusan
        }

        let checkIfExist = await Kelas.find({ 'kelas': model.kelas })
        if(checkIfExist.length > 0) {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Class is already taken')
        }

        let kelas = new Kelas(model);
        let query = await kelas.save();

        // this will get token to auth user and insert to activity
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

        // this will get token to auth user and insert to activity
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

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Delete All Class",user_id)
        return response.wrapper_success(res, 200, "Sukses Hapus Kelas", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                         
    }
   
}

async function deleteKelasbyId(req,res) {
    try {
        let query = await Kelas.findByIdAndRemove({ _id: req.query.id });
        
        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Delete Kelas",user_id)

        return response.wrapper_success(res, 200, "Sukses Delete Kelas", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                
    }
}

async function editKelas(req, res) {
    try {
        let id = req.query.id;
        let getByid = await Kelas.findById({ _id: id });
        let model = {
            kelas: req.body.kelas ? req.body.kelas : getByid.kelas,
            wali_kelas: req.body.wali_kelas ? req.body.wali_kelas : getByid.wali_kelas,
            jurusan: req.body.jurusan ? req.body.jurusan : getByid.jurusan,
        }

        let query = await Kelas.update({ _id: id }, model)

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Edit Kelas",user_id)

        return response.wrapper_success(res, 200, "Sukses Edit Kelas", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
}