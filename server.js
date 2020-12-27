//import data from "./products";

const express = require('express');
const app = express();
var data = require('./products.json');


app.use(express.static("public"));
app.use(express.static("images"));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
} );


app.get('/main.css', function(req, res){
    res.sendFile(__dirname + '/main.css');
} );


app.get('/data', function(req, res){
    res.json(data);
} );

app.listen(1234, function(){
    console.log("server listening");
});