var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function (err){
        if(err){ return next(err); }
        return res.json({token: user.generateJWT()})
    });
});
router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

router.post('/exportKML', function(req, res, next){
    fs.readFile('./template.ejs', 'utf8', function (err, template) {
        console.log("1");
        var content = ejs.render(template, {
            id           : tweet.id_str,
            lineStart    : geo[1].toString() + ',' + geo[0].toString() + ',' + altitude,
            lineEnd      : geo[1].toString() + ',' + geo[0].toString() + ',0',
            image        : config.imageUrl + tweet.id_str + '.png',
            quadAltitude : altitude,
            polyAltitude : altitude - 1,
            quadP1       : ( geo[1] - width ).toString() + ',' + ( geo[0] - height ).toString(),
            quadP2       : ( geo[1] + width ).toString() + ',' + ( geo[0] - height ).toString(),
            quadP3       : ( geo[1] + width ).toString() + ',' + ( geo[0] + height ).toString(),
            quadP4       : ( geo[1] - width ).toString() + ',' + ( geo[0] + height ).toString()
        });
        console.log("2");
        fs.writeFile('/views' + 'mmm' + '.kml', content, function (err) {
            console.log("3");
            if (err) { 
                console.log("4");
                console.log(err);
            }
            else { 
                console.log("5");
                callback();
            }
        });
    });
});

module.exports = router;
