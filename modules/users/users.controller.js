const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// import helper
const config = require('../../config.json');
const db = require('../../helpers/db');
const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const dateFormat = require('../../helpers/dateFormat');
const activity = require('../../helpers/insertActivity');

const User = db.User;
const Lapor = db.Lapor;
const Aktivitas = db.Aktivitas;

// routes
router.post('/admin/login', authenticateAdmin);
router.post('/admin/register', createAdmin);
router.get('/admin/all', getAllAdmin);
router.post('/register', registerUser);
router.post('/login', authenticateAdmin);
router.get('/all', getAllUser);
router.delete('/delete', deleteAllUser);
router.get('/get/', getUserbyId);
router.put('/edit', editUser);
router.get('/me', getUserbyToken)
router.delete('/remove', deleteUserbyId);
router.put('/admin/edit', editAdmin);
router.get('/search', searchUserbyNis);

module.exports = router;

async function createAdmin(req,res) {
    try {
        let model = {
            name : req.body.name,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10),
            role: "admin"
        }
        let checkEmail = await User.findOne({ "email" : model.email });
    
        if (checkEmail) {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Email is already taken')
        }
    
        const user = new User(model)
        let query = await user.save();
    
        return response.wrapper_success(res, 200, 'Succes Register Admin', query )
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')        
    }
    
}

async function authenticateAdmin(req, res) {
    try {
        let model = {
            email : req.body.email,
            password : req.body.password
        }
        const checkEmail = await User.findOne({ "email" : model.email });

        if(!checkEmail) {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Email Incorrect')
        }
    
        if(checkEmail && bcrypt.compareSync(model.password, checkEmail.password)) {
            const token = jwt.sign({ sub: checkEmail.id }, config.secret);
            
            // this will get token to auth user and insert to activity
            let activityModel = {
                user_id: checkEmail._id,
                username: checkEmail.name,
                activity: "Login",
                created_at: dateFormat(Date.now())
            }
    
            let activity = new Aktivitas(activityModel);
            await activity.save()
            return response.wrapper_success(res, 200, 'Succes Login', checkEmail, token)
        } else {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Password Incorrect')
        }
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                
    }

}

async function registerUser(req,res) {
    try {
        let model = {
            name: req.body.name,
            email: req.body.email,
            class: req.body.class,
            nis: req.body.nis,
            point: 0,
            password : bcrypt.hashSync(req.body.password, 10),
            role: "user"
        }
        let checkEmail = await User.findOne({ "email" : model.email });
    
        if (checkEmail) {
            return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Email is already taken')
        }
    
        const user = new User(model)
        let query = await user.save();
    
        return response.wrapper_success(res, 200, 'Succes Register User', query )
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')        
    }
    
}

async function getAllUser(req,res) {
    try {
        let query = await User.find({ "role": "user" });

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Get All User",user_id)

        return response.wrapper_success(res, 200, "Sukses Get All User", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
    
}

async function getAllAdmin(req,res) {
    try {
        let query = await User.find({ "role": "admin" });

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Get All Admin",user_id)

        return response.wrapper_success(res, 200, "Sukses Get All User", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')         
    }
    
}

async function deleteAllUser(req,res) {
    try {
        let query = await User.remove();

        // Activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Delete All User",user_id)

        return response.wrapper_success(res, 200, "Sukses Hapus All User", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
}

async function getUserbyId(req, res) {
    try {
        let query = await User.findById({ _id: req.query.id });
        let getPelanggaran = await Lapor.find({ 'user.id': req.query.id }).sort({ "createdDate": -1 })

        let model = {
            id: query.id,
            name: query.name,
            kelas: query.class,
            email: query.email,
            point: query.point,
            countPelanggaran: getPelanggaran.length,
            pelanggaran: getPelanggaran
        }

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Get User By Id",user_id)

        return response.wrapper_success(res, 200, "Sukses Get User", model)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
}

async function editUser(req, res) {
    try {
        let id = req.query.id;
        let getByid = await User.findById({ _id: id });

        let model = {
            name: req.body.name ? req.body.name : getByid.name,
            email: req.body.email ? req.body.email : getByid.email,
            class: req.body.class ? req.body.class : getByid.class,
            nis: req.body.nis ? req.body.nis : getByid.nis,
            password: bcrypt.hashSync(req.body.password, 10) ? bcrypt.hashSync(req.body.password): getByid.password,
            point: req.body.point ? req.body.point : getByid.point,
            role: req.body.role ? req.body.role: getByid.role
        }

        let query = await User.update({ _id: id }, model)

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Edit User",user_id)

        return response.wrapper_success(res, 200, "Sukses Edit User", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
}

async function getUserbyToken(req, res) {
    try {
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        let query = await User.find({ '_id': user_id });
        if(query.length < 1) {
            return response.wrapper_error(res, httpError.NOT_FOUND, 'User Not Found')        
        }

        if(query[0].role === 'user') {
            let getPelanggaran = await Lapor.find({ "user.id": user_id }).sort({ "createdDate": -1 })
            let photo;
            let model = {
                id: query[0]._id,
                nis: query[0].nis,
                name: query[0].name,
                class: query[0].class,
                point: query[0].point,
                email: query[0].email,
                createdDate: query[0].createdDate,
                photo: getPelanggaran[0].image ? photo: 'https://avatars0.githubusercontent.com/u/51704590?s=200&v=4'
            }

            // this will get token to auth user and insert to activity    
            activity("Get User by Token",user_id)
            return response.wrapper_success(res, 200, "Sukses Get User", model)
        } else {
            let model = {
                id: query[0]._id,
                nis: query[0].nis,
                name: query[0].name,
                class: query[0].class,
                point: query[0].point,
                email: query[0].email,
                createdDate: query[0].createdDate,
                photo: 'https://avatars0.githubusercontent.com/u/51704590?s=200&v=4'
            }
            
            // this will get token to auth user and insert to activity
            activity("Get User by Token",user_id)
            return response.wrapper_success(res, 200, "Sukses Get User", model)
        }
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')        
    }
}

async function deleteUserbyId(req,res) {
    try {
        let query = await User.findByIdAndRemove({ _id: req.query.id });

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Delete User",user_id)

        return response.wrapper_success(res, 200, "Sukses Delete User", query)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')                
    }
}

async function editAdmin(req, res) {
    try {
        let id = req.query.id;
        let getByid = await User.findById({ _id: id });
        let model = {
            name: req.body.name ? req.body.name : getByid.name,
            email: req.body.email ? req.body.email : getByid.email,
            password: bcrypt.hashSync(req.body.password, 10) ? bcrypt.hashSync(req.body.password): getByid.password,
            role: req.body.role ? req.body.role: getByid.role
        }

        let query = await User.update({ _id: id }, model)

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
    
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Edit Admin",user_id)

        return response.wrapper_success(res, 200, "Sukses Edit Admin", model)
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')
    }
}

async function searchUserbyNis(req,res) {
   try {
        let nis = req.query.nis;
        let query = await User.find({ 'nis': nis });

        // this will get token to auth user and insert to activity
        let token = req.headers.authorization.replace('Bearer ','');
        
        let decode = jwt.decode(token);
        let user_id = decode.sub;

        activity("Search User",user_id)

        return response.wrapper_success(res, 200, "Sukses Get User", query)
   } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Something is wrong')       
   }
}