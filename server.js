const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;
const index = require('./routes/index');
const auth = require('./routes/auth');
require('dotenv').config();


// Use cors middleware with specific configuration
app.use(cors({
    origin: "*"
  }));
  

const server = http.createServer(app);



app.use('/', index);
app.use('/auth',auth)

server.listen(port, () => console.log(`Listening on port ${port}`));

