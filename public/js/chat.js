const socket =io()
socket.on("clientConnected",(msgObject)=>{

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,{
        
        message:msgObject.message,
        createdAt : moment(msgObject.createdAt).format("h:mm a"),
        style: "background-color:blue;color:white" 
    });
    console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);


    //console.log(msg);
})

socket.on("newUserJoined",(msgObject)=>{

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,{
        message:msgObject.message,
        createdAt : moment(msgObject.createdAt).format("h:mm a"),
        style: "background-color:#21ff25;text-align:center;" 
    });
   // console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

   // console.log(msg);
})

socket.on("messageReceived",(msgObject)=>{

    
    //console.log(msg);
    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,
        
        { 
        message:msgObject.message,
        createdAt : moment(msgObject.createdAt).format("h:mm a")
     }
        
        );
    console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

})

socket.on("userLeft",(msgObject)=>{

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,{
        
        message:msgObject.message,
        createdAt : moment(msgObject.createdAt).format("h:mm a"),
        style: "background-color:silver;text-align:center;" 
    });
    console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

    //console.log(msg);
})
document.getElementById("messageForm").addEventListener('submit',

(e)=>{
  
    e.preventDefault();

    let msg =e.target.elements.message.value; 
    
    socket.emit("messageSent",msg,(error)=>{

        if(error){
           alert("no profane word is allowed!")
        }
        document.querySelector("#textBox").value="";
       document.querySelector("#textBox").focus();
        console.log("message delivered");
    });
}
)

socket.on("locationReceived",(msgObject)=>{

    setTimeout(()=>{

        document.querySelector("#find-me").disabled=false;
    },1000)

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#locationTemplate').innerHTML;
    
    const html = Mustache.render(template,{
        location:msgObject.message,
        createdAt : moment(msgObject.createdAt).format("h:mm a"),
    
    
    })
   // console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

    
    
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


const {name,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

  socket.emit("join",{
    name,
    room
  })