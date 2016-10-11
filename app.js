var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var consultor = require('./routes/consultor');
var reporte = require('./routes/reporte');
var bar = require('./routes/bar');
var pie = require('./routes/pie');


var app = express();
var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  database : 'com',
  user     : 'root',
  password : ''
});

db.connect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', routes);
app.use('/consultor', consultor);
app.use('/reporte', reporte);
app.use('/bar', bar);
app.use('/pie', pie);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
