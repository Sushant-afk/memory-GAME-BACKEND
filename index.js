const express = require('express');
const cors = require("cors");
const authRoute = require('./routes/auth')
const gameRoute = require('./routes/game')
const mongoose = require('mongoose')
require('dotenv').config()



const app = express();
const db = process.env.MONGO_URI

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  })
)

app.use("/api/auth", authRoute);
app.use("/api/game", gameRoute)


const port = process.env.PORT || 5000;

app.listen(port, () => { console.log(`Listening on port ${port}`) })
