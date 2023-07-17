const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config")
const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoute")
const redis = require("redis")
const session = require("express-session")
const RedisStore = require("connect-redis").default

let redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`
})

redisClient.connect().then(() => {
    console.log("Connected to Redis...")
}).catch((error) => {
    console.log("Cannot connect to Redis...", error)
})

const app = express()

const connectWithRetry = () => {
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
    // mongoose.connect(`mongodb://stephen:steve1234@172.23.0.2:27017/?authSource=admin`)
.then(() => {
    console.log("Connected to mongoDB...")
})
.catch((error) => {
    console.log("Cannot connect to the database...", error)
    setTimeout(connectWithRetry, 5000)
})
 
}

connectWithRetry()

app.enable("trust proxy") // trust the headers from nginx

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret : SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 60000 //1 minute
    }
}))


const PORT = process.env.PORT || 3000

app.use(cors()) // allow all origins/domains to access the api

app.use(express.json())

function protectRoute(req, res, next) {
    const { user } = req.session
    if (!user) {
        return res.status(401).json({
            status: "fail",
            message: "Unauthorized"
        })
    }
    req.user = user
    next()
}

app.use("/api/v1/posts", protectRoute, postRouter)
app.use("/api/v1/users", userRouter)

app.use("/api/v1/home", (req, res) => {
    try {
        console.log("nginx test")
        res.send({ 
            message: "Welcome to the home page.."
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT + "...")
})