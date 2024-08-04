require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connection = require('./server/config/db')
const expressLayout = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo');
const session = require('express-session');
const port = 5000;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());  
app.use(expressLayout);
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl : process.env.MONGO_URL
    })
}));
app.set('layout', './layouts/main')
app.set('view engine','ejs')
app.use('/',require('./routes/main.js'));
app.use('/', require('./routes/admin.js'))




connection(process.env.MONGO_URL)
.then(()=> console.log('Mongo db is connected'))


app.listen(port,() =>{
    console.log(`Server is running on ${port}`)
})