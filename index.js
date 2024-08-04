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

app.get('/user',async(req,res) =>{
    
    const users = await User.find();

    const usData = users.map(user =>{
        return{
            id:user._id,
            email:user.email
        }
    })

    res.status(200).json({usData})
})

function checkToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token =authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({msg:'acesso negado'}

        )

    }

    try {

        const secret = process.env.SECRET

        jwt.verify(token,secret);
        
        next()
        
    } catch (error) {
        return res.status(401).json({msg:'Token Invalido'} )
    }
}


app.get("/user/:id",checkToken, async(req,res) =>{

    const id = req.params.id

    const user = await User.findById(id,'-password')

    if(!user){
        res.status(404).json({msg:"Usuario nao encontrado"})
    }

    res.status(200).json({user})
})

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

app.post('/auth/user',async(req,res) =>{
    const {email,password} = req.body

    if(!email){
        return res.status(422).json({msg:'O email é obrigatorio'});
    }
    if(!password){
        return res.status(422).json({msg:'O password é obrigatorio'});
    }

    const user = await User.findOne({email:email})

    if(!user){

        return res.status(422).json({msg:'Usuario nao encontrado!'});

    }

    const checkPassword = await bcrypt.compare(password,user.password);

    if(!checkPassword){
        return res.status(404).json({msg:'Senha Invalida!'});
    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign(
        {
            id:user._id,
        },
        secret,
    )

        res.status(200).json({msg:'Autenticacao realizada com sucesso',token})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Aconteceu um erro no servidor, tente novamente mais tarde'});
    }





    
})

mongoose.connect(DB_URL=`mongodb+srv://${dbUser}:${dbPassword}@cluster1.hewl4v5.mongodb.net/authjwt?retryWrites=true&w=majority&appName=Cluster1`).
    then(() =>{
    console.log(`Conectado com sucesso!`);
}).catch((err) => console.log(err));

app.listen(port);