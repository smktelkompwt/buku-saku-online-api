const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// import helper
const config = require('../../config.json');
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const uploadBase64 = require('../../helpers/uploadBase64');

const User = db.User;
const Point = db.Point;
const Lapor = db.Lapor;
const Aktivitas = db.Aktivitas;

// routes
router.post('/upload', uploadPelanggaran);
module.exports = router;

async function uploadPelanggaran(req,res) {
    try {
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
    
        
        let getUser = await User.find({ "nis": req.body.nis })
        if(getUser.length < 1) {
            return response.wrapper_error(res, httpError.NOT_FOUND, 'Nis tidak ditemukan')         
        }
        
        let getPelapor = await User.find({ "_id": user_id });   
        if(getPelapor.length < 1) {
            return response.wrapper_error(res, httpError.UNAUTHORIZED, 'Token Expired, Silahkan Login Ulang')         
        } 
    
        let getPelanggaran = await Point.find({ "jenis_pelanggaran": req.body.pelanggaran_kategori})
        if(getPelanggaran.length < 1) {
            return response.wrapper_error(res, httpError.NOT_FOUND, 'Pelanggaran tidak ditemukan')         
        }

        let image = await uploadBase64(req.body.image);
        image.replace(/\./g,' ')
        let path = "localhost:3000/buku-saku-online-api"

        let model = {
            user: {
                id: getUser[0]._id,
                nis: getUser[0].nis,
                nama: getUser[0].name,
                kelas: getUser[0].class,
            },
            pelanggaran: {
                kategori: getPelanggaran[0].jenis_pelanggaran,
                point: getPelanggaran[0].point
            },
            pelapor: {
                id: getPelapor[0]._id,
                nama: getPelapor[0].name
            },
            image: path + image,
       }    
       let lapor = new Lapor(model)
       let query = await lapor.save();

       return response.wrapper_success(res, 200, 'Succes Upload Pelanggaran', query )
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, error)         
        
    }
}