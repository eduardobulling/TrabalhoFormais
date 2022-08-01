const express = require('express');

const analisadorController = require('./controller/analisadorController');


const routes = express.Router();

// Cobrador

//lista todas as paradas
routes.post('/analisador', analisadorController.le_Token);

//routes.get('/delete',analisadorController.delete);

module.exports = routes;