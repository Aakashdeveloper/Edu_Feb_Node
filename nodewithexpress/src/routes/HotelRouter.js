var express = require('express');
var hotelRouter= express.Router();
var mongodb = require('mongodb').MongoClient
var url= "mongodb://localhost:27017"

function route(menu){
  hotelRouter.route('/')
  .get((req,res) => {
    // for react/angular/view
    // res.send(hotels)
    // display through node
    mongodb.connect(url,function(err,connection){
      if(err){
        res.status(500).send("Error While Connecting")
      }else{
        const dbo = connection.db('edufeb');
        dbo.collection('hotels').find({}).toArray(function(err,data){
          if(err){
            res.send("Error while fetching")
          }else{
            res.render('hotel',{title:'Hotel Page',hoteldata:data,menu:menu})
          }
        })
      }
    })
  });

  hotelRouter.route('/details/:id')
    .get((req,res) => {
      //var id = req.params.id
      var {id} = req.params
      mongodb.connect(url,function(err,connection){
        if(err){
          res.status(500).send("Error While Connecting")
        }else{
          const dbo = connection.db('edufeb');
          dbo.collection('hotels').findOne({_id:id},function(err,data){
            if(err){
              res.send("Error while fetching")
            }else{
              res.render('hotelDetails',{title:'Hotel Details',hoteldata:data,menu:menu})
            }
          })
        }
      })
    });

    return hotelRouter
}



module.exports = route;