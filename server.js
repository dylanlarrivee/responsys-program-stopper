var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
var bcrypt = require('bcrypt');
const path = require('path');
const rp = require('request-promise');


const responsysApi = require('./controllers/responsysApi')

// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', process.env.PORT || 3000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};

// This pulls in static css and image files from the public folder
app.use(express.static(path.join(__dirname, '/public')));

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});


// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/views/signup.html');
    })
    .post((req, res) => {
        
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
            console.log('user' + user)
        })
        .catch(error => {
            res.redirect('/signup');
            console.log(error)
        });
    });


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/views/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

            User.findOne({ where: { username: username } })
                .then(user => {
                if (!user) {
                  return res.redirect('/login');
                }
                bcrypt
                  .compare(password, user.password)
                  .then(doMatch => {
                    if (doMatch) {
                      req.session.isLoggedIn = true;
                      req.session.user = user; 
                      return req.session.save(err => {
                        console.log(err);
                        res.redirect('/dashboard');
                      });
                    }
                    res.redirect('/login');
                  })
                  .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                  });
              })
              .catch(err => console.log(err));
    });


// route for user's dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/views/dashboard.html');
    } else {
        res.redirect('/login');
    }
});

// route for program stopped screen
app.get('/programstopped', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/views/program-updates-confirmed.html');
    } else {
        res.redirect('/login');
    }
});


// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        req.session.destroy(err => {
            console.log(err);
            res.redirect('/');
          });
    } else {
        res.redirect('/login');
    }
});

// routes for the Responsys API calls
app.post('/programsRefresh', function(req, res) {
    responsysApi.authTokenPrograms(responsysApi.authOptions,rp, responsysApi.responsys, res);
    // console.log(req);
    
});

app.post('/stopProgram', function(req, res) {
    responsysApi.stopProgram(responsysApi.authOptions,rp, responsysApi.responsys);
    // console.log(req);
    
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));