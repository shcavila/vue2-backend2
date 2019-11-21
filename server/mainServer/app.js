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


app.post('/org/offerbadge', upload.single('img'), (req, res, next) => {
    let user = jwt.decode(req.body.user)
    let date ={
        month : req.body.month,
        day: req.body.day,
        year: req.body.year
    }
    let badgeData = {
        date :date, 
        granted : req.body.granted,
        code: req.body.code,
        badgename: req.body.badgename,
        venue: req.body.venue,
        recipient: req.body.recipient,
        certificateName: req.body.certificateName,
        descriptions: req.body.descriptions,
        backgroundImg: req.file.filename,
        orgID: user._id
    }
     let badges = new Badges(badgeData );
    badges.save()

    .then(() => {
        res.json({message:"Successfull"});
        console.log('saved')
    }).catch((err) => {
        res.status(400).json({err:err.message})
        console.log(err)
    });
    
});


app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/org', orgRoute);

app.get('/', (req, res) => {
    res.send('hello')
});

app.listen(process.env.PORT || 8081);
console.log('app listening on post 8081');