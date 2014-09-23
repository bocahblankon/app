/**
 * Module
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , AnggotaProvider = require('./anggotaprovider').AnggotaProvider;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 7000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var userProvd= new AnggotaProvider('localhost', 27017);

//Routes

//index
app.get('/', function(req, res){
  userProvd.findAll(function(error, emps){
      res.render('index', {
            title: 'OLALA anggota',
            employees:emps
        });
  });
});

//tambah user
app.get('/user/new', function(req, res) {
    res.render('user_tambah', {
        title: 'Anggota Baru'
    });
});

//simpan user
app.post('/user/new', function(req, res){
    userProvd.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update user
app.get('/user/:id/edit', function(req, res) {
	userProvd.findById(req.param('_id'), function(error, user) {
		res.render('user_edit',
		{ 
			title: user.title,
			user: user
		});
	});
});

//simpan updated
app.post('/user/:id/edit', function(req, res) {
	userProvd.update(req.param('_id'),{
		title: req.param('title'),
		name: req.param('name')
	}, function(error, docs) {
		res.redirect('/')
	});
});

//hapus user
app.post('/user/:id/delete', function(req, res) {
	userProvd.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 7000);
