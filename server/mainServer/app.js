const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const authRoute = require("../routes/auth");
const userRoute = require("../routes/user.route")
const config = require("./DB");


mongoose.set('useCreateIndex', true)

mongoose
    .connect(config.DB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err);
        console.log("CONNECTION ERROR!");
    });


app.use(morgan("combined"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());




app.use("/auth", authRoute)
app.use("/user",userRoute)

app.get("/", (req, res) => {
    res.send("Hello")
})

app.listen(process.env.PORT || 8081)
console.log("app listening on post 8081")