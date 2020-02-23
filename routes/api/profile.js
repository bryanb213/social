const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@GET api/profile/me
//@dec get current user profile
//@access private
router.get('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
        ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ errors: [{ msg: 'User has no profile' }] });
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

//@POST api/profile
//@dec create or update user profile
//@access private

router.post('/', [
    //check authenticatio
    auth,
    //do validation
    [
        check('status','Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]],
    async (req, res) => {
        //cheeck for errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        //pull fields from body
        const {
            company,
            website,
            location,
            bio,
            status, 
            githubusername, 
            skills, 
            youtube, 
            facebook, 
            twitter,
            instagram, 
            linkedin
        } = req.body;

        //build profile object
        const profilefields = {};
        profilefields.user = req.user.id;
        if(company) profilefields.company = company;
        if(website) profilefields.website = website;
        if(location) profilefields.location = location;
        if(bio) profilefields.bio = bio;
        if(status) profilefields.status = status;
        if(githubusername) profilefields.githubusername = githubusername;
        //for no spaces
        if(skills) profilefields.skills = skills.split(',').map(skill => skill.trim())

        profilefields.social = {};
        if(youtube) profilefields.social.youtube = youtube;
        if(facebook) profilefields.social.facebook = facebook;
        if(twitter) profilefields.social.twitter = twitter;
        if(instagram) profilefields.social.instagram = instagram;
        if(linkedin) profilefields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.user.id })
            if(profile){
                //update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    {$set: profilefields},
                    { new: true });

                    return res.json(profile);
            }
            
            //Create profile with all fields
            profile = new Profile(profilefields);
            await profile.save();
            res.json(profile)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server error')
        }
    }
);


//@GET api/profile
//@dec get all profiles
//@access public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


//@GET api/profile/user/:user_id
//@dec get profile by user id
//@access public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'There is no profile for user' });
        }
        res.status(500).send('Server error')
    }
})


//@DELETE api/profile
//@dec get all profile user and post
//@access private
router.delete('/', auth, async (req, res) => {
    try {

        //remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'user deleted'});
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
});

//@PUT api/profile/experience
//@dec add profile experience
//@access private
router.put('/experience', [auth, 
    check('title', 'Title is required').not().isEmpty(),
    check('compant', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()

], async (req, res) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //remove user
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
});



module.exports = router;