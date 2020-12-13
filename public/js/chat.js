const socket =io()

const {name,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})



//auto scroll

const autoscroll = () => {
    // New message element
    const $messages = document.querySelector("#messages");
    const $newMessage = $messages.lastElementChild
    //console.log($newMessage)
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on("clientConnected",(msgObject)=>{

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,{
        
        username:msgObject.name,
        message:msgObject.message,
        createdAt : moment(msgObject.createdAt).format("h:mm a"),
        style: "background-color:#b823fc;color:white" 
    });
    console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

autoscroll()
    //console.log(msg);
})

socket.on("newUserJoined",(msgObject)=>{

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,{
        username: msgObject.name,
        message:msgObject.message,
        createdAt : moment(msgObject.createdAt).format("h:mm a"),
        style: "background-color:#21ff25;text-align:center;" 
    });
   // console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

   // console.log(msg);

   autoscroll()
})

socket.on("messageReceived",(msgObject)=>{

    
    //console.log(msg);
    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    let backgroundColor ="white";
    let color ="black";
    let float ="left";
    if (name.trim().toLowerCase()===msgObject.name){
        backgroundColor="blue";
        color="white";
        float ="right";
    }


    const html = Mustache.render(template,
        
        { 
        message:msgObject.message,
        username: msgObject.name,
        createdAt : moment(msgObject.createdAt).format("h:mm a"),
        style :`background-color:${backgroundColor};color:${color}` 
     }
        
        );
    //console.log(html)

     messageArea.insertAdjacentHTML("beforeend",html);
     autoscroll()

})

socket.on("userLeft",(msgObject)=>{

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,{
        
        message:msgObject.message,
        username:msgObject.name,
        createdAt : moment(msgObject.createdAt).format("h:mm a"),
        style: "background-color:silver;text-align:center;" 
    });
    console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

    //console.log(msg);
    autoscroll()
})
document.getElementById("messageForm").addEventListener('submit',

(e)=>{
  
    e.preventDefault();

    let msg =e.target.elements.message.value; 
    
    socket.emit("messageSent",msg ,(error)=>{

        if(error){
           alert("no profane word is allowed!")
        }
        document.querySelector("#textBox").value="";
       document.querySelector("#textBox").focus();
        console.log("message delivered");
    });
}
)


// location received 

socket.on("locationReceived",(msgObject)=>{

    

        document.querySelector("#find-me").disabled=false;
    

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#locationTemplate').innerHTML;
    let backgroundColor ="white";
    let color ="black";

    if( name.trim().toLowerCase()===msgObject.name ){
        backgroundColor="blue";
        color="white";
        float ="right";
    }
    const html = Mustache.render(template,{
        location:msgObject.message,
        username : msgObject.name,
        createdAt : moment(msgObject.createdAt).format("h:mm a"),
        style :`background-color:${backgroundColor};color:${color}`,
        anchorStyle : `color:${color};text-decoration:underline` 
    
    
    })
   // console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);
    autoscroll()
    
    
})


function geoFindMe() {

    if(!navigator.geolocation){
    return    console.log("not supported by your browser");
    }

    function success (position){

        document.querySelector("#find-me").disabled=true;
        socket.emit("sendLocation",

        `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
        , ()=>{
            console.log("location delivered");
        }
        )
  
    }
    
    function error (){

        console.log("unable to retrieve location")
    }
    navigator.geolocation.getCurrentPosition(success,error)

  }
  
  document.querySelector('#find-me').addEventListener('click', geoFindMe);



  socket.emit("join",{
    name,
    room
  },(error)=>{

    if(error){
    
      alert("this username is already taken or you have sent an empty username and chatroom")
     location.href="/";  
    }

    

  })


  socket.on("roomData",(roomInfo)=>{

    const {users,room} =roomInfo;

    const renderArea =document.querySelector("#totalUsers");
    const template = document.querySelector("#renderedUsersTemplate").innerHTML;
    const html = Mustache.render(template,{
        users,
        room
    
    })
    renderArea.innerHTML=html;


  })