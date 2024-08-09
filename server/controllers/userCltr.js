const User = require('../models/User')
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt=require('jsonwebtoken');
const userRouter = require('../routes/userRoutes');
const userCltr = {};

userCltr.register = async (req, res) => {
    const body = _.pick(req.body, ["username", "email", "password"]);
    console.log(body);

    try {
        const userExists = await User.findOne({ email: body.email }); 
        if (userExists) {
            res.status(400).json({ message: 'Email already exists. Please login.' });
            return; 
        }

        const user = new User(body);

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(body.password, salt);
        user.password = hashedPassword;
        const userRecord = await user.save();
        console.log(userRecord);
        res.status(200).json({ message: 'Registration Successful' ,user:userRecord});

    } catch (e) {

        res.status(400).json({ message: 'Registration Failed' });
    }
};
userCltr.login = async (req, res) => {
    const body = _.pick(req.body, ["email", "password"]);

    try {
        const userDoc = await User.findOne({ email: body.email });
        if (userDoc) {
            const result = await bcrypt.compare(body.password, userDoc.password);

            if (result) {
                const tokenData = { id: userDoc._id };
                const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                res.json({ 
                    token: `Bearer ${token}`, 
                    message: "Login Successful", 
                    id: userDoc._id 
                });
            } else {
                res.status(401).json({ message: "Invalid username/password" });
            }
        } else {
            res.status(401).json({ message: "Invalid username/password" });
        }
    } catch (err) {
        res.status(500).json({ error: "An error occurred during login", details: err.message });
    }
};

module.exports = userCltr;
