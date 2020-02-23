const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const config = require('config');

//@POST api/users
//@Desc Register user
//@access public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be more than six characters').isLength({ min: 6 }),
], async (req, res) => {
    //will hold errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    //pull used data
    const { name, email, password } = req.body
    try {
        //see if user exist
        let user = await User.findOne({ email })
        if(user){
            res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

    //GET user gravatar
        const avatar = gravatar.url(email, {
            //size
            s:'200',
            //rating
            r: 'pg',
            //default image
            d: 'mm'
        })
        user = new User({
            name,
            email,
            password,
            avatar
        });
    //encrypt pw
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

    //save user
    await user.save();
    //return jwt
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
            if(err) throw err;
            res.json({ token })
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router;