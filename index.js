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

const User = require('./models/User');

app.get('/',(req,res) =>{
    res.status(200).json({msg:'Bem vindo a nossa API'});88
});

app.post(`/auth/register`,async(req,res) =>{

    const{name,email,password,confirmpassword} = req.body;

    if(!name){
        return res.status(422).json({msg:'O nome é obrigatorio'});
    }
    if(!email){
        return res.status(422).json({msg:'O email é obrigatorio'});
    }
    if(!password){
        return res.status(422).json({msg:'O password é obrigatorio'});
    }
    if(!confirmpassword){
        return res.status(422).json({msg:'O confirm Password é obrigatorio'});
    }


    if( password !== confirmpassword){

        return res.status(422).json({msg:'As Senhas são diferentes'});
    }

    const userExist = await User.findOne({email:email})

    if(userExist){
        return res.status(422).json({msg:'Por favor utilize outro Email!'});
    }

    const salt = await bcrypt.genSalt(12);

    const passwordHash = await bcrypt.hash(password,salt);

    const user = new User({
        name,
        email,
        password:passwordHash
    })

    try {
        
        await user.save();

        res.status(201).json({msg:'Usuario Criado com sucesso!S'})


    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Ocorreu um erro ao tentar Inserir o Usuario"});
    }

})

mongoose.connect(DB_URL=`mongodb+srv://${dbUser}:${dbPassword}@cluster1.hewl4v5.mongodb.net/authjwt?retryWrites=true&w=majority&appName=Cluster1`).
    then(() =>{
    console.log(`Conectado com sucesso!`);
}).catch((err) => console.log(err));

app.listen(port);