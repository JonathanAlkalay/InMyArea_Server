const express = require('express');
const app = express();
const cors = require('cors');
const Businessdb = require('../schemas/business_schema');
const Userdb = require('../schemas/user_schema');
app.use(cors());
app.use(express.json())

const mongoose = require('mongoose');
const e = require('cors');
const mongoDB = "mongodb+srv://jonathan:Aa123654!@cluster0.2lj7x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(8080))
    .then(console.log("connected to mongo and server listening on port 8080"));




app.get('/logIn=:email&:passWord&:type', (request, response) => {

    const email = request.params.email;
    const password = request.params.passWord;
    const type = request.params.type


    if(type === 'user'){
        Userdb.findOne({ email: email })
            .then((usr) => {

                if(usr == null){
                    response.send({
                        "status": false,
                        "message": "user does not exist"
                    });
                }else{

                if(usr.passWord === password){    
                    usr.connected = true;
                    usr.save();
                    response.send({
                        "status": true,
                        "message": "log in successful"
                    });
                }else{
                    response.send({
                        "status": false,
                        "message": "wrong password"
                    });
                }
            }
            });
        }
        else if (type === 'business'){
            Businessdb.findOne({ email: email })
            .then((bsns) => {

                if(bsns == null){
                    response.send({
                        "status": false,
                        "message": "business does not exist"
                    });
                }else{

                if(bsns.passWord === password){    
                    bsns.connected = true;
                    bsns.save();
                    response.send({
                        "status": true,
                        "message": "log in successful"
                    });
                }else{
                    response.send({
                        "status": false,
                        "message": "wrong password"
                    });
                }
            }
            });
        }
        else{
            response.send({
                "status": false, 
                "message": "incorrect type provided"
            }); 
        }
       
});


app.get('/logOut=:email&:type', (request, response) => {

    const email = request.params.email;
    const type = request.params.type;

    if(type === 'user'){
    Userdb.findOne({ email: email })
        .then((usr) => {

            if(usr != null){
                usr.connected = false;
                usr.save();
                response.send({
                    "status": true,
                    "message": "logged out successfully"
                });
            }else{
                response.send({
                    "status": false,
                    "message": "user name is invalid"
                })
            }
        });
    }else if(type === "business"){
        Businessdb.findOne({ email: email })
        .then((bsns) => {

            if(bsns != null){
                bsns.connected = false;
                bsns.save();
                response.send({
                    "status": true,
                    "message": "logged out successfully"
                });
            }else{
                response.send({
                    "status": false,
                    "message": "user name is invalid"
                })
            }
        });

    }else{
        response.send({
            "status": false,
            "message": "incorrect username provided"
        });
    }
});


app.get('/createAccount=:email&:type', (request, response) => {

    const email = request.params.email;
    const password = request.body.passWord;
    const type = request.params.type;


    if (type === 'user'){
    Userdb.findOne({email: email})
        .then((usr) => {

            if(usr != null){
                response.send({
                    "status": false,
                    "message": "User already exists"
                })
            }else
                Userdb.create({ 
                                email: email, 
                                passWord: password,
                                name: request.body.name,
                                phoneNumber: request.body.phoneNumber,
                                connected: false});    

        });
    }else if(type === 'business'){

        Businessdb.findOne({email: email})
        .then((bsns) => {

            if(bsns != null){
                response.send({
                    "status": false,
                    "message": "Business already exists"
                })
            }else
                Businessdb.create({ email: email, 
                                    passWord: password,
                                    name: request.body.name,
                                    ownerName: request.body.ownerName,
                                    phoneNumber: request.body.phoneNumber,
                                    description: request.body.description,
                                    location: request.body.location,
                                    category: request.body.category, 
                                    connected: false});    
        });
        
    }else{
        response.send({
            "status": false, 
            "message": "invalid type provided"
        });
    }
});