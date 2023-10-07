const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "$$Nikhilisaveryveryrichperson$$"
// Route 1:Create a User using: post "/api/auth/createuser". login doesn't require
router.post('/createuser', [
    body('name', 'enter a valid name').isLength({min: 3}),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password must be atleast 5 characters').isLength({min: 5}),
] , async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

// check whether user exists with same email
try{
    let user = await User.findOne({email: req.body.email});
if(user){
    return res.status(400).json({error: "this email exists already."})
}
const salt = await bcrypt.genSaltSync(10);
const secPass= await bcrypt.hash(req.body.password, salt);
// create new user
user = await User.create({
    name: req.body.name,
    password: secPass,
    email: req.body.email
})

const data={
    user: {
        id: user.id
    }
}
const authtoken = jwt.sign(data, JWT_SECRET)
console.log(authtoken)

// res.json(user)
res.json({authtoken})

} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error.");
}

})
// Route 2: Authenticate a User using: post "/api/auth/login". Login doesn't require
router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists()
] , async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "try login with correct credentials."})
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({errors: errors.array()})
        }
        const data={
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        res.json({authtoken})
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})
// Route 3: Get loggedin User details: post "/api/auth/getuser". login require
router.post('/getuser', fetchuser , async (req, res) => {

try{
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user);
} catch(error){
    console.error(error.message);
    res.status(500).send("internal server error");
}
})
module.exports = router
