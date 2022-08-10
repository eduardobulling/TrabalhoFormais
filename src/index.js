var express = require('express');
var app = express();
var cors = require('cors')

app.use(cors())

const routes = require('./routes')

app.use(express.json());

app.use(routes)



app.listen(3010);