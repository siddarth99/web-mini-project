//import data from "./products";

const express = require('express');
const app = express();
var data = require('./products.json');
const parser = require("body-parser");
var firebase = require('firebase');
var cart = '';

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
    apiKey: "AIzaSyCzX8sKSTnJXEMCw_Q3MzJviP7Xr4U6kEI",
    authDomain: "furniture-store-c3d57.firebaseapp.com",
    databaseURL: "https://furniture-store-c3d57-default-rtdb.firebaseio.com/",
    storageBucket: "furniture-store-c3d57.appspot.com"
};

firebase.initializeApp(config);

app.post('/store_cart', function(req, res) {
    cart = req.body;
    cart = JSON.stringify(cart);
})


app.post('/contact', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;

    firebase.database().ref('contacts').child(name).push({
        email: email,
        message: message
    });
    res.sendFile(__dirname + '/public/index.html');
})

app.post('/auth', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(cart);
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            console.log(cart);

            firebase.database().ref('orders').child(firebase.auth().currentUser.uid).push({
                email: email,
                items: cart
            });

            res.sendFile(__dirname + "/public/index.html");
            // Signed in 
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            res.sendFile(__dirname + '/public/login_error.html');
        });

});



app.post('/signup', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var address = req.body.address;
    console.log(cart);
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            // Signed in 
            // ...
            firebase.database().ref('users').child(firebase.auth().currentUser.uid).set({
                email: email,
                address: address
            });

            firebase.database().ref('orders').child(firebase.auth().currentUser.uid).push({
                email: email,
                items: cart
            });
            console.log('signup success');
            res.sendFile(__dirname + "/public/index.html");
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
            res.sendFile(__dirname + "/public/signup_error.html");
        });
})

app.use(express.static("public"));

app.use(express.static("images"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login.html', function(req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/signup.html', function(req, res) {
    res.sendFile(__dirname + '/public/signup.html');
});


app.get('/main.css', function(req, res) {
    res.sendFile(__dirname + '/main.css');
});


app.get('/data', function(req, res) {
    res.json(data);
});


app.listen(1234, function() {
    console.log("server listening");
});