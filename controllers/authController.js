const User = require("../models/userModels")
const bcrypt = require("bcryptjs")

exports.signup = async (req, res) => {
    try {
        const {username, password} = req.body
        const newUser = await User.create(req.body)

        newUser.password = await bcrypt.hash(password, 12)
        await newUser.save()

        req.session.user = newUser

        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body

        if(!username || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Username or password is missing"
            })
        }

        const user = await User.findOne({username})

        if(!user) {
            return res.status(400).json({
                status: "fail",
                message: "User not found"
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if(isCorrect) {
            req.session.user = user

            return res.status(200).json({
                status: "success",
                message: "User logged in successfully"
            })
        }

        res.status(400).json({
            status: "fail",
            message: "Incorrect username or password"
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}