const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');

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

module.exports = router;