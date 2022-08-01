var express = require('express');
var app = express();


const routes = require('./routes')


app.use(routes)



app.listen(3000);