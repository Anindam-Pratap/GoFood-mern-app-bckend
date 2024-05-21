const express = require('express')
const router = express.Router()
const {body,validationResult} = require('express-validator')
const User = require('../models/User')
const mongoose = require('mongoose'); // Import Mongoose
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const jwtSecret = "zxcvbnmlkjhgfdsaqwertyuioplmkjhn"

// Connect to MongoDB
mongoose.connect("mongodb+srv://anindam835:Mongodb835@cluster0.51ppgv2.mongodb.net/GoFood?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Middleware to parse JSON bodies
router.use(express.json());

router.post('/createuser', [
body('email').isEmail(), 
body('name').isLength({min: 5}),
body('password').isLength({min: 6})],
body('location'),
async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { name, password, email, location } = req.body

    const salt = await bcrypt.genSalt(10)
    let secpassword = await bcrypt.hash(password,salt)

    try {
        
        await User.create({
            name,
            password: secpassword,
            email,
            location
        })
    res.json({success:true})
    } catch (error) {
        console.log(error)
        res.json({success:false})
    }
})

router.post('/loginuser', [
    body('email').isEmail(), 
    body('password').isLength({ min: 6 })
], async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract email and password from request body
    const { email, password } = req.body;

    try {
        // Find user by email
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ errors: "Invalid email or password" });
        }

        // Compare passwords
        const pwdCompare = await bcrypt.compare(password,userData.password)
        if (!pwdCompare) {
            return res.status(400).json({ errors: "Invalid email or password" });
        }
        
        //auth token
        const data = {
            user:{
                id:userData.id
            }
        }
        
        const authToken = jwt.sign(data,jwtSecret)

        // Authentication successful
        return res.json({ success: true,authToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router