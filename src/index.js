const express = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io');
const Filter = require('bad-words')
const app = express();
const {getTotalUsers,getUser,removeUser,addUser} =require('./utils/users')
const {generateMessage} = require('./utils/generate')
const server = http.createServer(app);
const io = socketio(server)

io.on("connection",(socket)=>{

    //console.log("client connected");
    
    
   

    // new user join event

    socket.on("join",({name,room},callback )=>{


    const {user,error} = addUser({name:name,room:room,id:socket.id});

    //console.log("running from index.js",error);
    if(error){

        return callback(error);
    }


    
    socket.join(user.room);

    socket.emit("clientConnected",generateMessage("admin","welcome"));

   
    socket.broadcast.to(user.room).emit("newUserJoined",
    generateMessage("admin",`${user.name} has joined!`) );

    io.to(user.room).emit("roomData",{

        room : user.room,
        users : getTotalUsers(user.room)
    })

    callback();
    })

    //send location event
    socket.on("sendLocation",(msg,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit("locationReceived",generateMessage(user.name,msg));
        callback();
    })


    //send message event 

    socket.on("messageSent",(msg,callback)=>{
        //console.log(msg)
        let receivedMessage ;
        try{
        const user = getUser(socket.id);

        const filter = new Filter()
        receivedMessage=msg;

       

       if (filter.isProfane(msg)){
          return callback("no profanity is allowed!");
       }
      // console.log(receivedMessage)
       io.to(user.room).emit("messageReceived", generateMessage(user.name,receivedMessage));
        callback();
    }
    catch(e){
        console.log(e);
    }
    })

    socket.on("disconnect",()=>{

    const removedUser = removeUser(socket.id);

    if(removedUser){
        io.to(removedUser.room).emit("userLeft",generateMessage("admin",`${removedUser.name} has left!`));
        io.to(removedUser.room).emit("roomData",{

            room : removedUser.room,
            users : getTotalUsers(removedUser.room)
        })
   
    }
      
    } )

    //io.emit("messageReceived", receivedMessage);
})


const port = process.env.PORT || 3000; 
const publicFolder = path.join(__dirname,'..','public');
//console.log(publicFolder)

app.use(express.static(publicFolder))
process.on("uncaughtException",(err)=>{
    console.log(err)
    process.exit(1)
})


server.listen(port,()=>{

    console.log("app is listening to ",port)
})