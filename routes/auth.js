const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register

router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        user = await user.save();
        res.status(200).json({
            success: true,
            user: user,
            message: "Registeration Successful"
        });

    } catch (error) {
        res.status(500).json(error);
    }

})

// Login

router.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(404).json({ success: false, message: "User not registered" })
        }
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if (!comparePassword) {
            res.status(404).json({ success: false, message: "Wrong Credentials" })
        }

        const { password, ...others } = user._doc;

        res.status(200).json({ success: true, message: "Login Successful", others })
    }

    catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

module.exports = router;