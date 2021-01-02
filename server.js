//import data from "./products";

const express = require('express');
const app = express();
var data = require('./products.json');
const parser = require("body-parser");
var firebase = require('firebase');
var cart = '';

app.use(parser.urlencoded({extended:false}));
app.use(parser.json());

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: ""
  };
  firebase.initializeApp(config);
  // Get a reference to the database service
  app.post('/store_cart', function(req, res){
     cart = req.body;
     cart = JSON.stringify(cart);
     console.log(cart);
     console.log("store");
})
 
  app.post('/auth', function(req, res){
      var email = req.body.email;
      var password = req.body.password;
      console.log(cart);
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            console.log(cart);
            firebase.database().ref('orders').set({uid:firebase.auth().currentUser.uid});

            firebase.database().ref('orders').child(firebase.auth().currentUser.uid).set({
              email:email,
              items: cart}
            );
            
            res.sendFile(__dirname+"/index.html");
    // Signed in 
    // ...
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        
    });

  });

  

  app.post('/signup', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var address = req.body.address;
    console.log(cart);
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // Signed in 
      // ...
      firebase.database().ref('users').push(firebase.auth().currentUser.uid);
    firebase.database().ref('users').child(firebase.auth().currentUser.uid).set({
      email:email,
      address: address
    });
    firebase.database().ref('orders').push(firebase.auth().currentUser.uid);

    firebase.database().ref('orders').child(firebase.auth().currentUser.uid).set({
      items: cart
    });
      console.log('signup success');
      res.sendFile(__dirname+"/index.html");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
    
  })

app.use(express.static("public"));
app.use(express.static("images"));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
} );

app.get('/login.html', function(req, res){
    res.sendFile(__dirname + '/login.html');
} );

app.get('/signup.html', function(req, res){
    res.sendFile(__dirname + '/signup.html');
} );


app.get('/main.css', function(req, res){
    res.sendFile(__dirname + '/main.css');
} );


app.get('/data', function(req, res){
    res.json(data);
} );

app.get('/send_data', function(req, res){
    firebase.database().ref('orders').set({
        email: email,
        address : address})
})

app.get('/login_status', function(req, res){
    var user = firebase.auth.currentUser;
    if(user){
        res.send('logged_in');
    }
    else{
        res.send('logged_out');
    }
})

app.listen(1234, function(){
    console.log("server listening");
});
