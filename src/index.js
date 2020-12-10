const express = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io');
const Filter = require('bad-words')
const app = express();

const server = http.createServer(app);
const io = socketio(server)

io.on("connection",(socket)=>{

    //console.log("client connected");
    socket.emit("clientConnected","welcome!");
    let receivedMessage ;
    
    socket.broadcast.emit("newUserJoined","A new user has joined!");

    socket.on("sendLocation",(msg,locationURL,callback)=>{

        io.emit("locationReceived",msg,locationURL);
        callback();
    })
    socket.on("messageSent",(msg,callback)=>{
        //console.log(msg)

        const filter = new Filter()
        receivedMessage=msg;

       

       if (filter.isProfane(msg)){
          return callback("no profanity is allowed!");
       }
       
       io.emit("messageReceived", receivedMessage);
        callback();
    })

    socket.on("disconnect",()=>{

        io.emit("userLeft","a user has disconnected");
    } )

    //io.emit("messageReceived", receivedMessage);
})

const port = process.env.PORT || 3000; 
const publicFolder = path.join(__dirname,'..','public');
//console.log(publicFolder)

app.use(express.static(publicFolder))


server.listen(port,()=>{

    console.log("app is listening to ",port)
})