const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const request = require('request');
const config = require('config');

//@GET api/profile/me
//@dec get current user profile
//@access private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
        ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ errors: [{ msg: 'User has no profile' }] });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

//@POST api/profile
//@dec create or update user profile
//@access private

router.post('/', [
    //check authentication
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
        //remove post
        await Post.deleteMany({ user: req.user.id });
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

//@route  DELETE api/profile/experience/:_user_id
//@desc   Add profile experience
//@access private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove user index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


//@PUT api/profile/education
//@dec add profile education
//@access private
router.put('/education', [auth, 
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()

], async (req, res) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //remove user
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
});

//@route  DELETE api/profile/eeducation:edu_id
//@desc   Add profile education
//@access private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove user index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


//@route  GET api/profile/github:username
//@desc   get user repo from github
//@access public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}/&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (error, response, body) => {
            if(error) console.log(error);

            if(response.statusCode !== 200){
                return res.status(400).json({ msg: 'No Github profile found' })
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


module.exports = router;