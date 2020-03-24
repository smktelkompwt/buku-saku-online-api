const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// import helper
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const dateFormat = require('../../helpers/dateFormat');
const activity = require('../../helpers/insertActivity');

const Aturan = db.Aturan;

// routes
router.get('/all', getAll);
router.get('/', getById);
router.delete('/delete', _delete);
router.get('/pasal', getPasal);
router.put('/edit/bab', editBab);
router.put('/edit/pasal', editPasal);
router.delete('/delete/bab', _deleteBab);
router.delete('delete/pasal', _deletePasal);

module.exports = router;

async function getAll(req,res) {
    try {
        let query = await Aturan.find();

                // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get All Peraturan",user_id)
        return response.wrapper_success(res, 200, "Sukses Get Peraturan Peraturan", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }
    
}

async function getById(req, res) {
    try {
        let model = {
            _id : req.query.id
        }
    
        let query = await Aturan.findById(model._id);

        // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get Peraturan by id",user_id)        
        return response.wrapper_success(res, 200, "Sukses Get Peraturan Peraturan by id", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                 
    }
}

async function _delete(req, res) {
    try {
        let query = await Aturan.remove();

                // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Delete All Peraturan",user_id)
        return response.wrapper_success(res, 200, "Sukses Hapus Peraturan", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                         
    }
   
}

async function getPasal(req, res) {
    try {
        let model = {
            _id : req.query.id,
            idPasal: req.query.idPasal
        }
    
        let query = await Aturan.findOne({_id: model._id},{ pasal: { $elemMatch: { _id: model.idPasal }} });
        let data = query.pasal[0];

        let newModel = {
            _id: data._id,
            title: data.title,
            desc: data.desc
        }
        // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;
 
        activity("Get Pasal",user_id)
        return response.wrapper_success(res, 200, "Sukses Get Peraturan Peraturan by id", newModel)
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                 
    }
}

async function editBab(req, res) {
    try {
        let id = req.query.id;
        let getByid = await Aturan.findById({ _id: id });

        let model = {
            bab: req.body.bab ? req.body.bab : getByid.bab
        }

        let query = await Aturan.updateOne({ _id: id }, model)

        let token = req.headers.authorization.replace('Bearer ', '');

        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Edit Bab", user_id)
        console.log(id);

        return response.wrapper_success(res, 200, "Sukses Edit Peraturan Peraturan by id", query)
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
}

async function editPasal(req, res) {
    try {
        let data = {
            "pasal.0.title": req.body.title
        }

        let query = Aturan.updateOne(
            { _id: req.query.id },
            { $set: data }
        )

        return response.wrapper_success(res, 200, "Sukses Edit Peraturan Peraturan by id", data);
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
}

async function _deleteBab(req, res) {
    try {
        let query = await Aturan.findByIdAndRemove({ _id: req.query.id });

        let token = req.headers.authorization.replace('Bearer ', '');

        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Delete Bab", user_id)
        return response.wrapper_success(res, 200, "Sukses Hapus Bab Peraturan", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }

}

async function _deletePasal(req, res) {
    try {
        let model = {
            id: req.query.id,
            idPasal: req.query.idPasal
        }

        let query = await Aturan.findOne({ _id: model.id }, { pasal: { $elemMatch: { _id: model.idPasal } } });
        let data = query.pasal[0];

        let newModel = {
            _id: data.pasal
        }

        let newQuery = await Aturan.remove({ _id: newModel._id });

        let token = req.headers.authorization.replace('Bearer ', '');

        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Delete Pasal", user_id)
        return response.wrapper_success(res, 200, "Sukses Hapus Pasal Peraturan", newQuery)
    } catch (error) {
        console.log(error);
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
}