const form = document.querySelector("#joinForm");

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const name = document.querySelector("#username").value;
    const room = document.querySelector("#room").value;

    location.href=`/chat.html?name=${name}&room=${room}`;
   // location.search=`name=${name}&room=${room}`;
    
})