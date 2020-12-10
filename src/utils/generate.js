const generateMessage = (message)=>{

    return{
        message,
        createdAt : new Date().getTime()
    }

}

module.exports={generateMessage}