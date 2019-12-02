const express = require('express');
const bodyParser = require('body-parser');
const app = express(); 
app.use(express.static('public')); // static files
app.use(bodyParser.urlencoded({ extended: true})); // body-parser
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID; // for query id

var url = "mongodb://localhost:27017/";

app.get('/onload', (req,res) => {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("attendance");
        dbo.collection("1912").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.json(result)
          db.close();
        });
      })
});

app.post('/change_information', (req, res) => {
    
    const query = req.body;
    console.log("updata value" , query._id, query.name, query.day1,query.day2);
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("attendance");
        var myquery = {_id: ObjectID(query._id)};
        var newvalues = { $set: { day1 : (query.day1), day2 : (query.day2)  } };
        
        // find and update
        var options = { returnOriginal: false };
        dbo.collection("1912").findOneAndUpdate(myquery, newvalues,options, function(err, result) {
            if (err) throw err;
            console.log(result)

            res.send(result.value)


            db.close();
        });

    });

});

app.listen(3030, () => console.log('Listening on port 3030'));
