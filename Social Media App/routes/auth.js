const routes = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register
// url ===> http://localhost:5000/api/auth/register
routes.post('/register', async(req, res) => {


try {
    // generate new hash password 
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    // create user in database
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword
    })

    // save user in database and return response 
    const user = await newUser.save();
    res.status(200).json(user);
} catch (error) {
    console.log(error);
    res.send({error : error.message});
}
})
// --------------
// Login 
// http://localhost:5000/api/auth/login  use this url for login
routes.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).send("User not found");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(404).send("Wrong password");
        }

        // Agar user aur password sahi hain, toh yahan se aap success response bhej sakte hain
        res.json({msg: "Login successful"});
    
    } catch (error) {
        // Agar koi error aata hai toh use catch karke response bhejein
        res.status(500).send(error.message);
    }
   
});


module.exports = routes