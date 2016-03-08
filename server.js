var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');

mongoose.connect('mongodb://localhost/express-api');

// Configure app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.port || 8080 // set out port

var router = express.Router(); // Get an instance of the express router

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
})

router.get('/', function(req, res) {
  res.json({message: 'hooray! welcome to our api!'});
});

router.route('/bears')
  // create a bear (accessed at POST http://localhost:8080/api/bears)
  .post(function(req, res) {
    var bear = new Bear();
    bear.name = req.body.name;

    bear.save(function(err) {
      if(err) {
        res.send(err);
      }

      res.json({message: 'Bear Created!'});
    })
  })

  .get(function(req, res) {
    Bear.find(function(err, bears) {
      if(err) {
        res.send(err)
      }

      res.json(bears);
    })
  });

// on routes that end in /bears/:bear_id
router.route('/bears/:bear_id')

  // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
  .get(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if(err) {
        res.send(err);
      }

      res.json(bear);
    })
  })

  // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
  .put(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if(err) {
        res.send(err);
      }

      bear.name = req.body.name;

      bear.save(function(err) {
        if(err) {
          res.send(err);
        }

        res.json({message: 'Bear Updated'});
      });

    });
  })

  .delete(function(req, res) {
    Bear.remove({
      _id: req.params.bear_id
    }, function(err, bear) {
      if(err) {
        res.send(err)
      }

      res.json({message: 'Successfully Deleted'});
    })
  })


// register our routs
// all of our routes will be prefixed with /api
app.use('/api', router);

// start the server
app.listen(port);
console.log('Magic happens on port ' +  port);



