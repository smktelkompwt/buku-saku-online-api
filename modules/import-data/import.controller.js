const express = require('express');
const jwt = require('jsonwebtoken');
const fetch = require("node-fetch");
const axios = require('axios')
const bcrypt = require('bcryptjs');
const router = express.Router();


// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const dateFormat = require('../../helpers/dateFormat');
const activity = require('../../helpers/insertActivity');

const Aturan = db.Aturan;
const Point = db.Point;
const User = db.User;
const Kelas = db.Kelas;

// routes
router.post('/peraturan', importPeraturan);
router.post('/point', importPoint);
router.post('/users/all', importAllUser);
router.post('/kelas', importKelas)

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

async function importAllUser(req,res) {
    try {
        console.log('LOADING....')
        let point = require('../../data/daftar-siswa.json');
        let result = [];

        for(let i=0; i<point.length; i++) {
            let data = point[i];
            let model = {
                nis: data.Nis.replace(/\s/g, ""),
                name: data.Nama,
                class: data.Kelas,
                jurusan: data.Jurusan,
                point: 0,
                email: `${data.Nis.replace(/\s/g, "")}@student.smktelkom-pwt.sch.id`,
                password: bcrypt.hashSync(data.Nis.replace(/\s/g, ""), 10),
                role: 'user'
            }
            result.push(model)
        }
        
        // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Import User",user_id)

        let query = await User.insertMany(result);
        return response.wrapper_success(res, 200, "Sukses Import User", query)
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }
}

async function importKelas(req,res) {
    try {
        let point = require('../../data/daftar-kelas.json');
        let query = await Kelas.insertMany(point);
        
        // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Import Kelas",user_id)
        return response.wrapper_success(res, 200, "Sukses Import Kelas", query)
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }
}