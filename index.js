require("dotenv").config()
const express = require("express") 
const morgan = require("morgan")
const {log} = require("mercedlogger")
const cors = require("cors")

const UserRouter = require("./controller/UserController")
const ProductRouter = require("./controller/ProductController")

const {PORT = 3000} = process.env

const app = express()

app.use(cors())
app.use(morgan("tiny")) 
app.use(express.json()) 

app.get("/", (req, res) => {
    res.send("Hello welcome to product management app!")
})

app.use("/user", UserRouter)
app.use("/product", ProductRouter)

app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`))