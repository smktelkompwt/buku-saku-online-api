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
        let countPelanggaran = 0;

        for(let i=0; i<query.length; i++) {
            if(query[i].point != 0) {
                countPelanggaran++
            }
        }

        let getPelanggaran = await Lapor.find();
        let arrayPelanggaranKategori = [];

        for(let a=0; a<getPelanggaran.length; a++) {
            let data = getPelanggaran[a].pelanggaran.kategori
            arrayPelanggaranKategori.push(data)
        }

        var rez={};
        let array = []

        getPelanggaran.forEach(function(item){
            rez[item.pelanggaran.kategori] ? rez[item.pelanggaran.kategori]++ :  rez[item.pelanggaran.kategori] = 1;
        });

        let key = Object.keys(rez);
        let values = Object.values(rez)

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
            pelanggaran: array
        }
        return response.wrapper_success(res, 200, "Sukses Get All Data Dashboard", model)
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }   
}