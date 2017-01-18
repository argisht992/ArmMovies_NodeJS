var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var fs = require('fs');

function getDataFromDB(res) {
  var movies = [];
  var db = new sqlite.Database('database');
  //"SELECT name, year FROM movies"
  db.serialize(function() {
    db.each("SELECT name, description, link, views, year, rate FROM movies ORDER BY year DESC", function (err, row) {
      if (err) {
        //TODO: show error message
        console.log("can't read database");
      }
      movies.push(row);
    }, function () {
      //callback function
      dbListener(movies, res, db);
    });
  });
  //db.close();
}

function dbListener(movies, res, db) {
  /**
   * send response to user
   * when two parallel requests
   * are complated successfully
   */
  /////////////////////////
  /*fs.readFile('public/images/paxirkamamusnacir.jpg', function(err, data) {
    var b = data.toString('base64');
    db.run("UPDATE movies SET image = ? WHERE id = ?", [ b, 1 ]);
  });*/

      //////////////////////////////
  /**
   * arrayList [newMoview, topMovies]
   */
    var json = makeJSON(movies);
    try {
      res.setHeader('Content-Type', 'application/json');
      res.send(json);
    } catch (err) {
      console.log("refresh");
    }
};

function makeJSON(movies) {
  /**
   * arrayList [newMoview, topMovies]
   */
   return JSON.stringify({
     data: movies
  });
}

router.get('/', function(req, res, next) {
  /*
   * get all data from DB,
   * order it by year and make JSONArray 1st element
   * get 2nd JSONArray element,
   * its will be same data but ordered by view
   * */
  //'public/images/paxirkamamusnacir.jpg'

  getDataFromDB(res);

});

module.exports = router;
