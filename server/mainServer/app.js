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


app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());




app.use('/auth', authRoute);
app.use('/user',userRoute);
app.use('/org', orgRoute);

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(process.env.PORT || 8081);
console.log('app listening on post 8081');