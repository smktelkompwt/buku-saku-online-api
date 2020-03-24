const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const dateFormat = require('../../helpers/dateFormat');
const activity = require('../../helpers/insertActivity');

const Point = db.Point;

// routes
router.get('/all', getAll);
router.get('/', getById);
router.delete('/delete', _delete);
router.get('/kategori', getKategoryPoint);
router.get('/kategori/list', getListKategori);
router.get('/kategori/prestasi/list', getListKategoriPrestasi);
router.get('/prestasi', getPrestasi);
router.delete('/remove', deleteById);
router.put('/edit', editPoint);
router.post('/create', createPoint);

module.exports = router;

async function getAll(req,res) {
    try {
        let query = await Point.find({ "tag": "pelanggaran" });

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get All Point",user_id)
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

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get Point By Id",user_id)
        return response.wrapper_success(res, 200, "Sukses Get Point Pelanggaran by id", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                 
    }
}

async function _delete(req, res) {
    try {
        let query = await Point.remove();
        
        // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Delete All Point",user_id)
        return response.wrapper_success(res, 200, "Sukses Hapus Data Point", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                         
    }
   
}

async function getKategoryPoint(req,res) {
    try {
        let kategori = req.query.kategori;

        let query = await Point.find({ kategori: kategori })
        
        // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get Kategori Point",user_id)
        return response.wrapper_success(res, 200, "Sukses Get Kategori", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                                 
    }
}

async function getListKategori(req,res) {
    try {
        let query = await Point.find({ "tag": "pelanggaran" });

        result = query.filter(function (a) {
            return !this[a.kategori] && (this[a.kategori] = true);
        }, Object.create(null));
    
        return response.wrapper_success(res, 200, "Sukses Get List Kategori", result)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                                 
    }
}

async function getListKategoriPrestasi(req,res) {
    try {
        let query = await Point.find({ "tag": "prestasi" });

        result = query.filter(function (a) {
            return !this[a.kategori] && (this[a.kategori] = true);
        }, Object.create(null));

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get List Kategori Prestasi",user_id)
    
        return response.wrapper_success(res, 200, "Sukses Get List Kategori Prestasi", result)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                                 
    }
}

async function getPrestasi(req,res) {
    try {
        let query = await Point.find({ "tag": "prestasi" });

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get All Point Prestasi",user_id)
        return response.wrapper_success(res, 200, "Sukses Get Point Prestasi", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }
}

async function deleteById(req,res) {
    try {
        let query = await Point.findByIdAndRemove({ _id: req.query.id });

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Delete Point",user_id)

        return response.wrapper_success(res, 200, "Sukses Delete Point", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                
    }
}

async function editPoint(req, res) {
    try {
        let id = req.query.id;
        let getByid = await Point.findById({ _id: id });

        let model = {
            kode: req.body.kode ? req.body.kode : getByid.kode,
            jenis_pelanggaran: req.body.jenis_pelanggaran ? req.body.jenis_pelanggaran : getByid.jenis_pelanggaran,
            point: req.body.point ? req.body.point : getByid.point,
            kategori: req.body.kategori ? req.body.kategori : getByid.kategori,
        }

        let query = await Point.update({ _id: id }, model)

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Edit Point",user_id)

        return response.wrapper_success(res, 200, "Sukses Edit Point", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
}

async function createPoint(req, res) {
    try {
        let model = {
            kode: req.body.kode,
            jenis_pelanggaran: req.body.jenis_pelanggaran,
            point: req.body.point,
            kategori: req.body.kategori,
            tag: req.body.tag
        }
        let checkEmail = await Point.findOne({ "kode": model.kode });

        if (checkEmail) {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Kode is already taken')
        }

        const point = new Point(model)
        let query = await point.save();
        
        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Create Point",user_id)
        return response.wrapper_success(res, 200, 'Succes Create Point', query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
}