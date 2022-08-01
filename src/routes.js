const express = require('express');

const analisadorController = require('./controller/analisadorController');


const routes = express.Router();

// Cobrador

//lista todas as paradas
routes.get('/analisador', analisadorController.index);

routes.get('/delete',analisadorController.delete);

module.exports = routes;