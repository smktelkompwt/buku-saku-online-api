const express = require('express');
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

        var count = {};
        arrayPelanggaranKategori.forEach(function(i) { 
            count[key] = (count[key]||0) + 1;
        });

        let titleCount = Object.keys(count);
        console.log(titleCount)
        
        // for(let o=0; o<getPelanggaran.length; o++) {
        //     let getValues = Object.keys(count[o]);
        //     console.log(getValues)
        // }
        // console.log(count)
        let model = {
            countSiswa: query.length,
            countPelanggaran: countPelanggaran,
            countPalingSering: count
        }
        return response.wrapper_success(res, 200, "Sukses Get All Kelas", model)
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }   
}