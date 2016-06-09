var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var wpConfig = require('./webpack-dev-server.config')
var express = require('express')
var session = require('express-session')
var fbConfig = require('./config')('local')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var User = require('./src/server/user').User
var Image = require('./src/server/image').Image

var request = require('request')

var app = express()
var port = 3000

var AWS = require('aws-sdk')
AWS.config.update({accessKeyId: fbConfig.aws_credentials.access_keyID, secretAccessKey: fbConfig.aws_credentials.secret_access_key});
var sqs = new AWS.SQS({region:'us-west-2'}); 


// give the app the simplest controller

router = express.Router()
router.get('/',  function(req, res) {
  res.sendFile(__dirname + '/src/www/index.html')
})

router.get('/api/first.js',  function(req, res) {
  res.sendFile(__dirname + '/api/first.js')
})
app.use(router);

app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));

console.log("fbConfig:", fbConfig);

// app.use(express.logger('dev'))

var compiler = webpack(wpConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: false, publicPath: wpConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
  console.log(" server.js serializing user: ", user);
  console.log(" server.js serializing user facebook_id: ", user.facebook_id);
  done(null, user.facebook_id)
});


passport.deserializeUser(function(user, done) {
  console.log("deserializing user: ", user);
  User.getOrCreateFBUser(user, null, function(err, ruser) {
    if (err) { return done(null, "nobody"); }
    done(null, ruser);
  });
});

passport.use(new FacebookStrategy({
  clientID: fbConfig.facebook_credentials.clientID,
  clientSecret: fbConfig.facebook_credentials.clientSecret,
  callbackURL: "http://localhost.blnz.com:3000/auth/facebook/callback"
},
                                  function(accessToken, refreshToken, profile, done) {
                                    console.log("verify callback",
                                                { "accessToken": accessToken,
                                                  "refreshToken": refreshToken,
                                                  "profile": profile,
                                                  "done": done });
                                    
                                    User.getOrCreateFBUser(profile.id, profile.displayName, function(err, user) {
				      if (err) {
					return done(err);
				      }
				      User.setUserFBAccessToken(user, accessToken);
				      done(null, user);
                                    });
                                  }
                                 ));

app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
  console.log("session: ", req.session);
  if (req.isAuthenticated()) { return next(); }
  res.status(403).send('not authorized');
}

function ensureAPIAuthenticated(req,res,next) {

  const authToken = req.query['auth_token'];
  if (typeof authToken === 'string') {
    console.log("authToken is:", authToken);
    User.findByAuthToken(authToken, function(err, userObj) {
      if (err) {
	res.status(403).send('not authorized');
	return;
      }
      if (userObj && userObj['user_uuid']) {
	req['authenticatedUser'] = userObj;
	next();
      } else {
	console.log("authToken not validated");
	res.status(403).send('not authorized');
      }
    });
  } else {
    console.log("NO authToken");
    res.status(403).send('not authorized');
  }
}

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook', { session: true, scope: ['user_friends', 'email', 'user_photos',
										     'user_tagged_places' ] }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
	passport.authenticate('facebook', { session: true,
					    successRedirect: '/',
					    failureRedirect: '/login' }));


console.info("running at " , __dirname);


app.get('/ckuser',  ensureAuthenticated, function(req, res) {
  
  console.log('ckuser:: user is: ', req.user);
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(req.user, null, 4));
});

// a horrible hack that sets a global variable in the webapp when invoked via <script src='...
app.get('/ckuser.js',   function(req, res) {

  usrJson = '{}';
  if (req.isAuthenticated()) {
    usrJson = JSON.stringify(req.user, null, 4);
  } 

  res.setHeader("Content-Type", "application/javascript");
  res.send("var loggedInUser = ".concat(usrJson).concat(";"));
});

app.get('/api/search', ensureAPIAuthenticated, function(req, res) {

  console.log(req.url)
  var solrURL = 'http://ec2-54-187-86-241.us-west-2.compute.amazonaws.com:8983/solr/imgcat/select'.concat('?').concat(req.url.split('?')[1]);
  console.log(solrURL);
  req.pipe(request(solrURL)).pipe(res)

});

app.get('/api/image/:id', ensureAPIAuthenticated, function(req, res) {

  console.log("image ID:", req.param('id'));
  Image.findByID(req.param('id'), function(err, data) {
    if (err) {
      res.status(500).send("failed to get" + req.param('id'));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(data, null, 4));
    }
  });

});

app.delete('/api/users/:id',  ensureAPIAuthenticated, function(req, res) {

  if (req.authenticatedUser['user_uuid'] === parseInt(req.params.id), 10) {
    console.log("authenticated user will purge content ...");
    Image.deleteOwnerImages(req.authenticatedUser['user_uuid'], function(err,data) {
      if (err) {
	console.log(err);
	res.status(500).send("failed to delete user's images");
	return;
      }
      console.log("images deleted, now on to user");
      User.deleteUser(req.authenticatedUser, function(err, data) {
	if (err) {
	  console.log(err);
	  res.status(500).send("failed to delete user");
	  return;
	}
	console.log("user deleted, now on to index");
	var solrURL = 'http://ec2-54-187-86-241.us-west-2.compute.amazonaws.com:8983/solr/imgcat/update?commit=true';
	
	console.log(solrURL);
	var deleteStr = "<delete><query>owner:".concat(req.authenticatedUser['user_uuid']).concat("</query></delete>")
	console.log(deleteStr)
	//	oldbody: "<delete><query>*:*</query></delete>"
	request.post({ url: solrURL, headers: {"Content-Type": "text/xml"}, body: deleteStr}, function (err, data) {
	  if (err) {
	    console.log(err);
	    res.status(500).send("failed to delete in Solr");
	  } else {
	    // console.log(data);
	    res.send(data.body);
	    return;
	  }
	});
      });
    });

  } else {
    
    console.log("UN-authenticated user will NOT purge content ...");
    console.log("user id from auth token:", req.authenticatedUser['user_uuid'])
    console.log("user id from params:", req.params.id)
    res.status(401).send("not authenticated");
  }
  
});

app.post('/api/users/:id/refresh',  ensureAPIAuthenticated, function(req, res) {

  if (req.authenticatedUser['user_uuid'] === parseInt(req.params.id), 10) {
    console.log("authenticated user will check content for: ", req.params.id);
    
    token = User.userFBAccessToken(req.authenticatedUser);
    var msg = { token: token };
    console.log("message:", msg);
    sqs.createQueue({QueueName: 'imgcat-user'}, function (err, data) {
      if (err) {
	console.log(err);
	res.status(500).send("failed");
      }
      if (data) {
	var url = data.QueueUrl; // use this queue URL to operate on the queue
	var sqsParams = {
	  MessageBody: JSON.stringify(msg),
	  QueueUrl: url
	};
	
	sqs.sendMessage(sqsParams, function(err, data) {
	  if (err) {
	    console.log('ERR', err);
	    res.status(500).send("failed");
	    return;
	  }
      
	  console.log(data);
	  res.send('initiated refresh');
	});
      }
    });
  } else {
    console.log("UN-authenticated user will NOT refresh content ...");
    console.log("user id from auth token:", req.authenticatedUser['user_uuid'])
    console.log("user id from params:", req.params.id)
    res.status(401).send("not authenticated");
  }
  
});



app.get('/logout',  function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/userUpdate',  ensureAuthenticated, function(req, res) {

  console.log("userUpdate params:",  req.params);
  userObj = {
    facebook_id: req.param('facebook_id'),
    username: req.param('username'),
    display_name: req.param('display_name'),
    icloud_credential: req.param('icloud_credential'),
    wants_status_email: req.param('wants_status_email'),
    email: req.param('email')
  }
  User.updateFBUser(userObj, function(err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.redirect('/');
    }
    
  });
  
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/src/www/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
