const express = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io');
const Filter = require('bad-words')
const app = express();
const {generateMessage} = require('./utils/generate')
const server = http.createServer(app);
const io = socketio(server)

io.on("connection",(socket)=>{

    //console.log("client connected");
    
    
    //socket.to.broadcast.emit("newUserJoined",generateMessage("A new user has joined!"));


    socket.on("join",({name,room})=>{

    socket.join(room);

    socket.emit("clientConnected",generateMessage("welcome"));
   
    socket.broadcast.to(room).emit("newUserJoined",generateMessage(`${name} has joined!`) )


    })
    socket.on("sendLocation",(msg,callback)=>{

        io.emit("locationReceived",generateMessage(msg));
        callback();
    })
    socket.on("messageSent",(msg,callback)=>{
        //console.log(msg)
        let receivedMessage ;
        const filter = new Filter()
        receivedMessage=msg;

       

       if (filter.isProfane(msg)){
          return callback("no profanity is allowed!");
       }
      // console.log(receivedMessage)
       io.emit("messageReceived", generateMessage(receivedMessage));
        callback();
    })

    socket.on("disconnect",()=>{

        io.emit("userLeft",generateMessage("a user has disconnected"));
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