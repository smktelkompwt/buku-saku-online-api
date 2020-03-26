const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const dateFormat = require('../../helpers/dateFormat')
const activity = require('../../helpers/insertActivity');

const Kelas = db.Kelas;
const User = db.User;
const Lapor = db.Lapor;

// routes
router.get('/all', getAll);

module.exports = router;

async function getAll(req,res) {
    try {
        let query = await User.find({ 'role': 'user' });

        let getPelanggaran = await Lapor.find();
        let getKelas = await Kelas.find();
        
        let arrayPelanggaranKategori = [];

        for(let a = 0; a < getPelanggaran.length; a++) {
            let data = getPelanggaran[a].pelanggaran.kategori
            arrayPelanggaranKategori.push(data)
        }

        var result = {};
        let array = []

        getPelanggaran.forEach(function(item){
            result[item.pelanggaran.kategori] ? result[item.pelanggaran.kategori]++ :  result[item.pelanggaran.kategori] = 1;
        });

        let key = Object.keys(result);
        let values = Object.values(result)

        for(let index = 0; index < key.length; index++) {
            let models = {
                title: key[index],
                count: values[index]
            }
            array.push(models)
        }
        
        let model = {
            countSiswa: query.length,
            countPelanggaran: getPelanggaran.length,
            countKelas: getKelas.length,
            pelanggaran: array
        }

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ', '');

        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Get Data Dashboard", user_id)
        return response.wrapper_success(res, 200, "Sukses Get All Data Dashboard", model)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }   
}