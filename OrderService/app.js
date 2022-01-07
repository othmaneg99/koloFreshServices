var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var usersRouter = require('./routes/users');
var ordersRouter = require('./routes/orders')
var decisionRouter = require('./routes/decision')
var orderRouter = require('./routes/order');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


app.use('/', indexRouter);
app.use('/orders', ordersRouter);
app.use('/decisionOrder', decisionRouter);
//app.use('/users', usersRouter);
app.use('/order', orderRouter);


module.exports = app;
