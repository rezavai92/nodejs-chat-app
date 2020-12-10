const socket =io()
socket.on("clientConnected",(msg)=>{

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,{message:msg,
    style: "background-color:blue;color:white" 
    });
    console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);


    console.log(msg);
})

socket.on("newUserJoined",(msg)=>{

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,{message:msg,
        style: "background-color:#21ff25;text-align:center;" 
    });
    console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

    console.log(msg);
})

socket.on("messageReceived",(msg)=>{

    
    console.log(msg);
    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,{message:msg});
    console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

})

socket.on("userLeft",(msg)=>{

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#messageTemplate').innerHTML;
    
    const html = Mustache.render(template,{
        
        message:msg,
    
        style: "background-color:silver;text-align:center;" 
    });
    console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

    console.log(msg);
})
document.getElementById("messageForm").addEventListener('submit',

(e)=>{
  
    e.preventDefault();

    let msg =e.target.elements.message.value; 
    
    socket.emit("messageSent",msg,(error)=>{

        if(error){
           return console.log(error);
        }
        document.querySelector("#textBox").value="";
       document.querySelector("#textBox").focus();
        console.log("message delivered");
    });
}
)

socket.on("locationReceived",(msg,locationURL)=>{

    setTimeout(()=>{

        document.querySelector("#find-me").disabled=false;
    },1000)

    const messageArea = document.querySelector("#messages");
    const template = document.querySelector('#locationTemplate').innerHTML;
    
    const html = Mustache.render(template,{location:locationURL})
   // console.log(typeof(html))

     messageArea.insertAdjacentHTML("beforeend",html);

    console.log(msg);
    console.log(locationURL);
    
})


function geoFindMe() {

    if(!navigator.geolocation){
    return    console.log("not supported by your browser");
    }

    function success (position){

        document.querySelector("#find-me").disabled=true;
        socket.emit("sendLocation",
        `Location: ${position.coords.latitude},${position.coords.longitude} `,
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