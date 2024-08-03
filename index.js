require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

port =process.env.PORT;

const dbUser = process.env.DB_USER;
const dbPassword =process.env.DB_PASS;

const app = express();

app.use(express.json());

app.get('/',(req,res) =>{
    res.status(200).json({msg:'Bem vindo a nossa API'});88
});

mongoose.connect(DB_URL=`mongodb+srv://${dbUser}:${dbPassword}@cluster1.hewl4v5.mongodb.net/authjwt?retryWrites=true&w=majority&appName=Cluster1`).
    then(() =>{
    console.log(`Conectado com sucesso!`);
}).catch((err) => console.log(err));

app.listen(port);