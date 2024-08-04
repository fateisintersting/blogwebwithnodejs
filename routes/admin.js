const express =require('express');
const router = express.Router();
const User = require('../server/models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const adminLayout = '../views/layouts/admin';
const jwtsecret = process.env.JwT_SECRET


const authMiddleware = (req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
    try{
        const decode = jwt.verify(token,jwtsecret)
        req.userId = decode.userId;
        next()
    }catch(err){
        res.status(401).json({message: 'Uanutgorized'})
    }
}








router.get('/admin',async (req,res) =>{
    
    try{
        const local = {
            title : 'Admin',
            description :'SIMPLE ADMIN PAGE'
        }
        res.render('admin/index',{local , layout : adminLayout})
    }catch(err){
        console.log(err)
    }

})


router.post('/admin',async (req,res) =>{
    try{
        const { username , password} = req.body;
        const user = await User.findOne( {username});

        if(!user){
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        const isPasswordvalid = await bcrypt.compare(password,user.password);
         if(!isPasswordvalid){
            return res.status(401).json({ message: 'Invaild credentials'})
         }

         const token = jwt.sign({userId: user._id},jwtsecret);
         res.cookie('token',token , {httpOnly:true});

         res.redirect('/dashboard')
        
    }catch(err){
        console.log(err)
    }

})


router.get('/dashboard', authMiddleware, async (req,res)=> {
    const local = {
        title : 'Admin',
        description :'SIMPLE ADMIN PAGE'
    }
    res.render('admin/dashboard',{local});
});


router.post('/register',async (req,res) =>{
    try{
        const { username , password} = req.body;
        const hashedPAssword = await bcrypt.hash(password,10);

        try{
            const user = await User.create({username,password:hashedPAssword})
            res.status(201).json({message:'User Created',user})
        }catch(err){
            if(err.code===11000){
                res.status(409).json({message:'User is use',user})
            }
            res.status(500).json({message:'Server Error'})
        }

        }catch(err){
        console.log(err)
    }

})



module.exports = router;