const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const authRoute = require('../routes/auth');
const userRoute = require('../routes/user.route');
const orgRoute = require('../routes/org.route');
const config = require('./DB');
const store = require('../modules/storage')
const multer = require('multer')
const path = require('path')
const Badges = require('../models/Badges')
const jwt = require('jsonwebtoken')
const url = 'mongodb+srv://badgebookdb:badgebookdb2019@cluster0-pn3a6.mongodb.net/test?retryWrites=true&w=majority'


mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose
    .connect(config.DB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err);
        console.log('CONNECTION ERROR!');
    });

var upload = multer({
    storage: store.storage
});



app.use('/static', express.static(path.join(__dirname, 'uploads')))
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());



app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/org',upload.single('img'), orgRoute);


app.get('/', (req, res) => {
   res.sendFile('img-1574323573523.jpg', {root: __dirname+'/uploads'})
});

var port = process.env.PORT || 8081
//app.listen(process.env.PORT || 8081);
//console.log('app listening on post 8081');
const server = app.listen(port, function() {
    console.log('app listening on post:', port);
});
const io = require("socket.io")(server);
app.set('socketio', io);