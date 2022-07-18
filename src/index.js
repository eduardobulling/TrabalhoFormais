const express = require('express');

const app = express();




app.use(express.json({limit: '50mb'}));



app.listen(9000, () => console.log('Express started at http://localhost:9000'));
