const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "$$Nikhilisaveryveryrichperson$$"
// Create a User using: post "/api/auth/createuser". Doesn't require auth
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
// eslint-disable-next-line no-undef
const authtoken = jwt.sign(data, JWT_SECRET)
console.log(authtoken)

// res.json(user)
res.json({authtoken})

} catch(error){
    console.error(error.message);
    res.status(500).send("some error occured");
}

})

module.exports = router
