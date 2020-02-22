const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

//@GET api/auth
router.get('/', auth, async (req, res) => {
    try {
        // we can use req.user because in our middleware we 
        //send the ID in the token as a request
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


//@POST api/auth
//@Desc Authenticate user and get token
router.post('/', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists(),
], async (req, res) => {
    //will hold errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    //pull user data
    const { email, password } = req.body
    try {
        //see if user exist
        let user = await User.findOne({ email })
        if(!user){
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        //match password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

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