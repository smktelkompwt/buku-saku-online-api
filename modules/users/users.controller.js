const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// import helper
const config = require('../../config.json');
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');

const User = db.User;

// routes
router.post('/admin/login', authenticateAdmin);
router.post('/admin/register', createAdmin);

module.exports = router;

async function createAdmin(req,res) {
    try {
        let model = {
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            password : bcrypt.hashSync(req.body.password, 10)
        }
        let checkEmail = await User.findOne({ "email" : model.email });
    
        if (checkEmail) {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Email is already taken')
        }
    
        const user = new User(model)
        let query = await user.save();
    
        return response.wrapper_success(res, 200, 'Succes Register User', query )
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')        
    }
    
}

async function authenticateAdmin(req, res) {
    try {
        let model = {
            email : req.body.email,
            password : req.body.password,
        }
        const checkEmail = await User.findOne({ "email" : model.email });

        if(!checkEmail) {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Email Incorrect')
        }
    
        if(checkEmail && bcrypt.compareSync(model.password, checkEmail.password)) {
            const token = jwt.sign({ sub: checkEmail.id }, config.secret);
            return response.wrapper_success(res, 200, 'Succes Login', checkEmail,token )
        } else {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Password Incorrect')
        }
    } catch (error) {
        console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                
    }

}

