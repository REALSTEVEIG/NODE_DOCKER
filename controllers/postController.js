const Post = require("../models/postModels")


exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        console.log("nginx test")
        res.status(200).json({
            status: "success",
            results: posts.length,
            data: {
                posts
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.getOnePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json({
            status: "success",
            data: {
                post
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.createPost = async (req, res) => {
    try {
        const post = await Post.create(req.body)
        res.status(201).json({
            status: "success",
            data: {
                post
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: "success",
            data: {
                post
            }   
        })
    } catch (error) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: "success",
            data: null
        })
    } catch (error) {
        res.status(400).json({
            status: "fail"
        })
    }
}