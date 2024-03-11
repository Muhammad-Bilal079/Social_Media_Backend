const User = require("../models/User");
const routes = require('express').Router();
const bcrypt = require("bcrypt");

// updateUser 

// http://localhost:5000/api/users/(yahan database say lakar user ki id daalni hai) just like===>>> http://localhost:5000/api/users/65e8dece9e5f1045c80a9da8

routes.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        // console.log(req.params.id);
        // console.log("User object found:", user);
        if (!user) {
            return res.status(404).json("User not found");
        }

        if (req.body.userId !== req.params.userId && !(req.User && req.User.isAdmin)) {
            return res.status(403).json("You can update only your account");
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        await User.findByIdAndUpdate(req.params.id, { $set: req.body });
        res.status(200).json("Account has been updated successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});

// deleteUser 
// http://localhost:5000/api/users/65e8deb39e5f1045c80a9da6

routes.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json("User not found");
        }

        if (req.body.userId !== req.params.userId && !(req.User && req.User.isAdmin)) {
            return res.status(403).json("You can deleted only your account");
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});

// getUsers
// http://localhost:5000/api/users/65e8dee29e5f1045c80a9daa

routes.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, createdAt, ...other } = user._doc;
        res.status(200).json(other);

    } catch (error) {
        console.log(error);
    }
})
// followUser

// http://localhost:5000/api/users/65ef64a92d22975ca517127b/follow

routes.put('/:id/follow', async (req, res) => {
    const userId = req.body.userId;
    const followedUserId = req.params.id;

    if (userId === followedUserId) {
        res.status(403).json("You can't follow yourself");
        return;
    }

    try {
        const userToFollow = await User.findById(followedUserId);
        const currentUser = await User.findById(userId);

        if (!userToFollow.followers.includes(userId)) {
            await User.findByIdAndUpdate(followedUserId, { $push: { followers: userId } });
            await User.findByIdAndUpdate(userId, { $push: { following: req.params.id } });
            res.status(200).json("User has been followed");
        } else {
            res.status(403).json("You already follow this user");
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// unfollowUser

// http://localhost:5000/api/users/65ef64a92d22975ca517127b/unfollow

routes.put('/:id/unfollow', async (req, res) => {
    const userId = req.body.userId;
    const followedUserId = req.params.id;

    if (userId === followedUserId) {
        res.status(403).json("You can't unfollow yourself");
        return;
    }

    try {
        const userToFollow = await User.findById(followedUserId);
        const currentUser = await User.findById(userId);

        if (userToFollow.followers.includes(userId)) {
            await User.findByIdAndUpdate(followedUserId, { $pull: { followers: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { following: req.params.id } });
            res.status(200).json("User has been unfollowed");
        } else {
            res.status(403).json("You dont unfollow this user");
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});


module.exports = routes