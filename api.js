var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var port = process.env.PORT || 3000;     
var json = getConfig('public/data/api.json');
var gd = require('node-gd');
var Canvas = require('canvas')
, Image = Canvas.Image
, canvas = new Canvas(100, 100)
, ctx = canvas.getContext('2d');

// ==============================================================================
// APP SETUP 
// ==============================================================================

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');


// ==============================================================================
// JSON FUNCTIONS 
// ==============================================================================
function readJsonFileSync(filepath, encoding){

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file){

    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}


// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

/// MISC 
app.use(express.static(__dirname + '/public'));

/// WEBSITE ROUTES
app.get('/', function (req, res) {
  res.render('index',  {
    page_name: 'index'
  });
});
app.get('/doc', function (req, res) {
  res.render('documentation',  {
    page_name: 'documentation'
  });
});
app.get('/api-doc', function (req, res) {
  res.render('api-doc',  {
    page_name: 'api-doc'
  });
});
app.get('/demos', function (req, res) {
  res.render('demos',  {
    page_name: 'demos'
  });
});
app.get('/credits', function (req, res) {
  res.render('credits',  {
    page_name: 'credits'
  });
});

app.get('/test', function (req, res) {
  res.render('test',  {
    page_name: 'test'
  });
});

/// DEMOS ROUTES 
app.get('/demo-user-list', function (req, res) {
  res.render('demos/user-list',  {
    page_name: 'demos'
  });
});
app.get('/demo-testimonials', function (req, res) {
  res.render('demos/testimonials',  {
    page_name: 'demos'
  });
});
// =============================================================================
/// API 
// =============================================================================
var users = getConfig('public/data/api.json');


/// API FUNCTIONS
var findUserById = function (id, callback) {
  console.log(users.name)
  if (!users[id])
    return callback(new Error(
      'No user matching '
       + id
      )
    );
  return callback(null, users[id]);
};

var findUserFace = function (id, callback) {
  if (!users[id])
    return callback(new Error(
      'No face matching '
       + id
      )
    );
  return callback(null, users[id].face); 
};

var findUserName = function (id, callback) {
  if (!users[id])
    return callback(new Error(
      'No face matching '
       + id
      )
    );
  return callback(null, users[id].name); 
};

var findUserJob = function (id, callback) {
  if (!users[id])
    return callback(new Error(
      'No Job matching '
       + id
      )
    );
  return callback(null, users[id].job_title); 
};

var generatesUserImage = function (id, callback) {
  if (!users[id])
    return callback(new Error(
      'No face matching '
       + id
      )
    );
  return callback(null, users[id].face); 
};

var findUserFacePng = function (id, callback) {
  if (!users[id])
    return callback(new Error(
      'No face matching '
       + id
      )
    );
  return callback(null, users[id].face); 
};


// ==============================================================================
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    console.log('Hapenning on => ' + this);
    console.log('Request => ' + req[0]);
    console.log('Response => ' + res[0]);
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json(json);   
});

/// API DOC 

/// /api/1 => User profile
/// /api/1/name => User name
/// /api/1/face => User face
/// /api/1/png => User profile as png on canvas
/// /api/1/face/png => User face as png on canvas
/// /api/1/face/png/100 => Get emoji resized as a png 
/// /api/1/face/png/100/100 => Get emoji resized as a png & resize the canvas 


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


/// API ENDPOINTS
///============================================================================

/// /api/1 => User profile
app.get('/api/:userid', function(request, response, next) {
  var userid = request.params.userid;
  findUserById(userid, function(error, user) {
    if (error) return next(error);
    return response.json('user', user);
    // return response.sendFile('/api/persona/' + userid);
  });
});

/// /api/1/name => User name
app.get('/api/:userid/name', function(request, response, next) {
  var userid = request.params.userid;
  console.log(request.params, next)
  findUserName(userid, function(error, user) {
    if (error) return next(error);
    return response.json('name', user);
  });
});

/// /api/1/job => User name
app.get('/api/:userid/job', function(request, response, next) {
  var userid = request.params.userid;
  console.log(request.params, next)
  findUserJob(userid, function(error, user) {
    if (error) return next(error);
    return response.json('job', user);
  });
});


/// /api/1/face => User face
app.get('/api/:userid/face', function(request, response, next) {
  var userid = request.params.userid;
  console.log(request.params, next)
  findUserFace(userid, function(error, user) {
    if (error) return next(error);
    return response.json('face', user);
  });
});

/// /api/1/png => User profile as png on canvas
app.get('/api/:userid/png', function (req, res) {
  var userid = req.params.userid;
  var reqid = req.query.userid;
  res.locals.id = userid; 
  res.render('canvas',  {
    page_name: 'canvas',
    id: userid,
    size: false,
    canvasSize: false
  });
});

/// /api/1/face/png => User face as png on canvas
app.get('/api/:userid/face/png', function (req, res) {
  var userid = req.params.userid;
  var reqid = req.query.userid;
  res.locals.id = userid; 
  res.render('canvas-face',  {
    page_name: 'canvas-face',
    id: userid,
    size: false,
    canvasSize: false
  });
});

/// /api/1/face/png/100 => Get emoji resized as a png 
app.get('/api/:userid/face/png/:size', function (req, res) {
  var userid = req.params.userid;
  var size = req.params.size;
  var userid = req.params.userid;
  var reqid = req.query.userid;
  res.locals.id = userid; 
  res.render('canvas-face-size',  {
    page_name: 'canvas-face-size',
    id: userid,
    size: size,
    canvasSize: false
  });
});

/// /api/1/face/png/100/100 => Get emoji resized as a png & resize the canvas 
app.get('/api/:userid/face/png/:size/:canvasSize', function (req, res) {
 
  var userid = req.params.userid;
  var size = req.params.size;
  var canvasSize = req.params.canvasSize;
  var userid = req.params.userid;
  var reqid = req.query.userid;
  res.locals.id = userid; 
  res.render('canvas-face-size',  {
    page_name: 'canvas-face-size',
    id: userid,
    size: size,
    canvasSize: canvasSize
  });
});


/// TODO
///============================================================================

// Generates and stream a png file 
// Accessible via url as .png
app.get('/api/:userid/face/png&img=true', function (req, res) {
 
  var userid = req.params.userid;
  var reqid = req.query.userid;
  res.locals.id = userid; 

 findUserFacePng(userid, function(error, user) {
    if (error) return next(error);
    
    var b = new Buffer(user);
    console.log(user);

   var ctx = canvas.getContext('2d'); 
    ctx.font = "200pt Calibri,Geneva,Arial";
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.fillStyle = "rgb(0,20,180)";
    ctx.textBaseline = 'top';
    ctx.fillText(user, 200, 200);
    var img = canvas.toDataURL();

console.log('<img src="' + img + '" />');

  });

  res.sendFile('./out.png', { root: __dirname });
  // var base64Data = req.userid.replace(/^data:image\/png;base64,/, "");

  var base64Data = '0X04';
  var binaryData = new Buffer(base64Data, 'base64').toString('binary');

  require("fs").writeFile("out.png", binaryData, "binary", function(err) {
    console.log(err); // writes out file without error, but it's not a valid image
  });
});



