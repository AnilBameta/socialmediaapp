const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const mongoose = require('mongoose')
const resolvers = require('./Resolvers');
const typeDefs = require('./Typedefs');



async function startServer(){
    const app=express()
    const apolloServer=new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start()
   
    apolloServer.applyMiddleware({app:app});
   
    app.use((req,res)=>{
        res.send("Hello From Apollo Server");
    })
   mongoose.connect('mongodb+srv://AnilBameta:AnilgotAtlas@cluster0.9zgnr.mongodb.net/SMData?retryWrites=true&w=majority')
   .then(()=>console.log("Database Connected"))
   .catch(err=> console.log(err))
    app.listen(5000,()=>console.log("Apollo Server Is Running"))
   }
   startServer();


