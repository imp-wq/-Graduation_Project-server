const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 12;

exports.postUser = async ( req, res ) => {
    let { name, email, password } = req.body;

    let hashedPassword = await bcrypt.hash(password, saltRounds);

    const searchUser = await User.findOne({email});

    if(searchUser) return res.status(409).send();

    const newUser = await User({firstname: name, email, password:hashedPassword });

    const token = jwt.sign({_id: newUser._id}, process.env.TOKEN_SECRET);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    };

    try{
        newUser.save()
        .then(() => {
            res.cookie('jwt', token, cookieOptions);

            res.status(200).json();
        })
        .catch(err => {
            console.log(err.message);
            res.status(400).json();
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getUser = async ( req, res ) => {
    let { email, password } = req.body;

    console.log(req);
    console.log(req.auth);



    try{
        const user = await User.findOne({email}).select('+password');

        const validPass = await bcrypt.compare(password, user.password);

        const authorized = validPass ? true : false;

        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        };

        if (!user || !authorized) {
            res.status(401).json({
                status: 'fail',
                message: "Incorrect combination"
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    
        res.cookie('jwt', token, cookieOptions);

        res
            .status(200)
            .header("auth-token", token)
            .json({
            status:'success',
            name: user.firstname,
            email: user.email
        }) 
    }
    catch(err){
        console.log(err.message);
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}


exports.verifyToken = async (req, res, next ) => {

    const { auth } = req.headers;
    const { email } = req.query;

    const result = jwt.verify(auth, process.env.TOKEN_SECRET);

    try{
        const user = await User.findById(result._id);

        if (user.email === email) {
            res.status(200).end();
            next();
        }

    } catch (err) {
        // clear whatever existing cookie there is.
        res.status(403).end();
    }


}