const { response } = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const routes = require('express').Router();

// Create a post 

// http://localhost:5000/api/posts

routes.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).send(savedPost);
    } catch (error) {
        res.send(error.message);
    }
})
// update a post 

//http://localhost:5000/api/posts/65ef705a8bbc6360d7cf018f
// {
//     "userId":"65ef64a92d22975ca517127b",
//     "desc":"this is my updated post content"
// }

// update kay liay is tarha dono ids deni hongi ek mongodb ki hai or ek user ki hai or isi tarha say baki method bhi chalaingay jo is post ki file main mojood hain

routes.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).send("post has been updated successfully")
        } else {
            res.status(404).send("You can update only your post")
        }
    } catch (error) {
        res.send(error.message);
    }
})
// delete a post 

routes.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).send("post has been deleted successfully")
        } else {
            res.status(404).send("You can delete only your post")
        }
    } catch (error) {
        res.send(error.message);
    }
})

// like a post

// http://localhost:5000/api/posts/65ef705a8bbc6360d7cf018f/like
// {
//     "userId":"65ef64ba2d22975ca517127d"
// }
// is main is tarha like karin gay post ko or userId main woh ayayga jo like kar rha hai or uper / kay bad us ki id ayay gi jis ki post per like horaha ho 


routes.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).send("The post has been liked !")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).send("The post can not be liked !")
        }

    } catch (error) {
        res.send(error.message)
    }
})

// get a post 

// http://localhost:5000/api/posts/65ef705a8bbc6360d7cf018f

routes.get('/:id', async function (req, res) {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).send(post)
    } catch (error) {
        res.send(error.message)
    }
})

// getAll timepost

// http://localhost:5000/api/posts/timeline/data
// {
//     "userId":"65ef64ba2d22975ca517127d"
// }
// is main jab hum user ki id dain gay to usnay jis jis ko follow kia hoga unsabka data la kardega

routes.get('/timeline/data', async (req, res) => {
    // let postArray = [];
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPost = await Post.find({ userId: currentUser._id })
        const friendsPost = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPost.concat(...friendsPost));
    } catch (error) {
        res.send(error.message)
    }

})

module.exports = routes